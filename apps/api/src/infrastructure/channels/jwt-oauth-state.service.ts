import jwt from 'jsonwebtoken';
import { appConfig } from '../../config/app.config.js';
import type {
  OAuthStatePayload,
  OAuthStateService,
} from '../../modules/channels/interfaces/oauth-state.interface.js';

const STATE_TTL = '10m';

export class JwtOAuthStateService implements OAuthStateService {
  sign(payload: OAuthStatePayload): string {
    return jwt.sign(payload, appConfig.security.oauthStateSecret, { expiresIn: STATE_TTL });
  }

  verify(state: string): OAuthStatePayload {
    return jwt.verify(state, appConfig.security.oauthStateSecret) as OAuthStatePayload;
  }
}
