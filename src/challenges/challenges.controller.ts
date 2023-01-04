import {
  BadRequestException,
  Body,
  Controller,
  Logger,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { ClientProxySmartRanking } from 'src/proxymq/client-proxy.proxymq';
import { CreateChallengesDTO } from './dto/create-challenges.dto';
import { PlayerInterface } from 'src/players/interfaces/player.interface';
import { firstValueFrom } from 'rxjs';

@Controller('challenges')
export class ChallengesController {
  constructor(
    private readonly clientProxySmartRanking: ClientProxySmartRanking,
  ) {}

  private clientChllenges =
    this.clientProxySmartRanking.getClientProxyChallengesInstance();

  private clientAdminBackend =
    this.clientProxySmartRanking.getClientProxyAdminBackendInstance();

  private readonly logger = new Logger(ChallengesController.name);

  @Post()
  async createChallenge(@Body() challenge: CreateChallengesDTO) {
    // Verificar se os jogadores estão cadastrados
    const players: PlayerInterface[] = await this.clientAdminBackend
      .send('consultar-jogador', '')
      .toPromise();

    challenge.players.map((playerDto) => {
      const playersFilter: PlayerInterface[] = players.filter(
        (player) => player._id == playerDto._id,
      );
      this.logger.log(JSON.stringify(playersFilter));

      if (playersFilter.length == 0) {
        throw new BadRequestException(
          `O jogador ${playerDto._id} não é um jogador`,
        );
      }
      // Verifica se os joadores fazem parte da categoria informada
      if (playersFilter[0].category != challenge.category)
        throw new BadRequestException(
          `o jogador ${playersFilter[0]._id} não faz parte da categoria informada`,
        );
    });

    // Verifica se o solicitante é o jogador da partida

    const requesterIsPlayerInMatch: PlayerInterface[] =
      challenge.players.filter((player) => player._id == challenge.requester);

    this.logger.log(
      `requesterIsPlayerInMatch: ${JSON.stringify(requesterIsPlayerInMatch)}`,
    );

    if (requesterIsPlayerInMatch.length == 0)
      throw new BadRequestException(
        'O solicitante deve ser um jogador da partida',
      );

    // Verifica se a categoria está cadastrada

    const category = await firstValueFrom(
      this.clientAdminBackend.send('pegar-categoria', challenge.category),
    );

    if (!category) throw new NotFoundException('Categoria não encontrada');

    this.clientChllenges.emit('criar-desafio', challenge);
  }
}
