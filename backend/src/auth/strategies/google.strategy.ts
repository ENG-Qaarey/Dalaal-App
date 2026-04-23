import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(configService: ConfigService) {
    const apiPrefix = configService.get<string>('app.apiPrefix') || 'api';
    const port = configService.get<number>('app.port') || 3000;
    // In production, you'd use a real domain
    const callbackURL = configService.get<string>('app.nodeEnv') === 'production'
      ? `https://api.dalaal.com/${apiPrefix}/auth/google/callback`
      : `http://localhost:${port}/${apiPrefix}/auth/google/callback`;

    super({
      clientID: configService.get<string>('oauth.googleClientId') || 'dummy-client-id',
      clientSecret: configService.get<string>('oauth.googleClientSecret') || 'dummy-client-secret',
      callbackURL,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    const { id, displayName, emails, photos } = profile;
    const user = {
      googleId: id,
      email: emails?.[0]?.value,
      name: displayName,
      avatar: photos?.[0]?.value,
    };
    done(null, user);
  }
}
