import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { firstValueFrom } from 'rxjs';
import { PlayerInterface } from 'src/players/interfaces/player.interface';
import { ClientProxySmartRanking } from 'src/proxymq/client-proxy.proxymq';

@Injectable()
export class AuthService {
  constructor(
    private readonly clientSmartRanking: ClientProxySmartRanking,
    private readonly jwtService: JwtService,
  ) {}

  private readonly logger = new Logger(AuthService.name);

  private clientBackEndAdmin =
    this.clientSmartRanking.getClientProxyAdminBackendInstance();

  async login(user: Partial<PlayerInterface>) {
    const payload = { sub: user._id, email: user.email };
    this.logger.log(`No login ${JSON.stringify(payload)}`);

    return {
      token: this.jwtService.sign(payload),
    };
  }

  async validateUser(email: string) {
    let user: PlayerInterface;
    try {
      const users: PlayerInterface[] = await firstValueFrom(
        this.clientBackEndAdmin.send('consultar-jogador', ''),
      );

      Promise.all(
        users.map((player) => {
          if (player.email == email) user = player;
        }),
      );
    } catch (error) {
      return null;
    }

    return user;
  }
}
