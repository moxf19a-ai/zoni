import type { Request, Response, NextFunction } from 'express';
import type { AuthService } from './auth.service.js';
import { registerSchema } from './validation/register.validation.js';
import { loginSchema } from './validation/login.validation.js';
import { refreshTokenSchema } from './validation/refresh-token.validation.js';
import { validate } from '../../presentation/http/validate.js';
import type { ApiSuccessResponse } from '../../presentation/http/api-response.type.js';
import type { AuthTokensDto } from './dto/auth.dto.js';

function tokensResponse(tokens: AuthTokensDto): ApiSuccessResponse<AuthTokensDto> {
  return { success: true, data: tokens };
}

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const input = validate(registerSchema, req.body);
      const tokens = await this.authService.register(input);
      res.status(201).json(tokensResponse(tokens));
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const input = validate(loginSchema, req.body);
      const tokens = await this.authService.login(input);
      res.status(200).json(tokensResponse(tokens));
    } catch (error) {
      next(error);
    }
  };

  refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { refreshToken } = validate(refreshTokenSchema, req.body);
      const tokens = await this.authService.refresh(refreshToken);
      res.status(200).json(tokensResponse(tokens));
    } catch (error) {
      next(error);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { refreshToken } = validate(refreshTokenSchema, req.body);
      await this.authService.logout(refreshToken);
      res.status(200).json({ success: true, data: null } satisfies ApiSuccessResponse<null>);
    } catch (error) {
      next(error);
    }
  };
}
