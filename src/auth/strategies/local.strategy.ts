import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { MessageHelper } from 'src/helpers/message.helper';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }

  private readonly logger = new Logger(LocalStrategy.name);

  async validate(email: string) {
    const user = await this.authService.validateUser(email);

    if (!user)
      throw new UnauthorizedException(MessageHelper.Password_Or_Email_Invalid);

    return user;
  }
}
