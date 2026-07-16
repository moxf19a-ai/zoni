import type { UsersService } from '../users/users.service.js';
import type { TokenService } from './interfaces/token-service.interface.js';
import type { PasswordHasher } from './interfaces/password-hasher.interface.js';
import type { RefreshTokensRepository } from './interfaces/refresh-tokens-repository.interface.js';
import type { EventBus } from '../../application/interfaces/event-bus.interface.js';
import { EmailAlreadyInUseError, InvalidCredentialsError, InvalidRefreshTokenError } from './auth.errors.js';
import type { RegisterRequestDto, LoginRequestDto, AuthTokensDto } from './dto/auth.dto.js';

export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
    private readonly passwordHasher: PasswordHasher,
    private readonly refreshTokensRepository: RefreshTokensRepository,
    private readonly eventBus: EventBus,
  ) {}

  async register(input: RegisterRequestDto): Promise<AuthTokensDto> {
    const existingUser = await this.usersService.findByEmail(input.email);
    if (existingUser) {
      throw new EmailAlreadyInUseError('An account with this email already exists.');
    }

    const passwordHash = await this.passwordHasher.hash(input.password);
    const user = await this.usersService.createUser({
      email: input.email,
      passwordHash,
      fullName: input.fullName,
    });

    // Milestone 4's Event Bus in real use: other modules can react to
    // registration later (welcome email, analytics...) without AuthService
    // knowing or caring who's listening.
    this.eventBus.publish('user.registered', { userId: user.id, email: user.email });

    return this.issueTokens(user.id, user.email);
  }

  async login(input: LoginRequestDto): Promise<AuthTokensDto> {
    const user = await this.usersService.findByEmail(input.email);
    if (!user) {
      throw new InvalidCredentialsError('Invalid email or password.');
    }

    const passwordMatches = await this.passwordHasher.compare(input.password, user.passwordHash);
    if (!passwordMatches) {
      throw new InvalidCredentialsError('Invalid email or password.');
    }

    return this.issueTokens(user.id, user.email);
  }

  async refresh(rawRefreshToken: string): Promise<AuthTokensDto> {
    const tokenHash = this.tokenService.hashRefreshToken(rawRefreshToken);
    const stored = await this.refreshTokensRepository.findValidByHash(tokenHash);

    if (!stored) {
      throw new InvalidRefreshTokenError('Refresh token is invalid or has expired.');
    }

    // Rotation: the old refresh token is revoked as soon as it's used once,
    // whether or not the caller ends up using the new pair — this limits
    // the damage window if a refresh token is ever stolen.
    await this.refreshTokensRepository.revoke(stored.id);

    const user = await this.usersService.findPublicById(stored.userId);
    if (!user) {
      throw new InvalidRefreshTokenError('Refresh token no longer matches an active account.');
    }

    return this.issueTokens(user.id, user.email);
  }

  /**
   * Revokes a refresh token so it can no longer be used. Intentionally
   * idempotent (no error for an already-invalid token) — from the client's
   * perspective, "log out" should always succeed.
   */
  async logout(rawRefreshToken: string): Promise<void> {
    const tokenHash = this.tokenService.hashRefreshToken(rawRefreshToken);
    const stored = await this.refreshTokensRepository.findValidByHash(tokenHash);

    if (stored) {
      await this.refreshTokensRepository.revoke(stored.id);
    }
  }

  private async issueTokens(userId: string, email: string): Promise<AuthTokensDto> {
    const accessToken = this.tokenService.signAccessToken({ sub: userId, email });
    const { token: refreshToken, tokenHash, expiresAt } = this.tokenService.generateRefreshToken();

    await this.refreshTokensRepository.create({ userId, tokenHash, expiresAt });

    return { accessToken, refreshToken };
  }
}
