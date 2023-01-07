import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ClientProxySmartRanking } from 'src/proxymq/client-proxy.proxymq';
import { CreateChallengesDTO } from './dto/create-challenges.dto';
import { PlayerInterface } from 'src/players/interfaces/player.interface';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { ChallengeInterface } from './interfaces/challenges.interface';
import { ChallengeStatus } from './interfaces/challenge-status.enum';
import { UpdateChallengeDTO } from './dto/update-challenge.dto';
import { AddChallengeForMatch } from './dto/add-player-for-match.dto';
import { CategoriesInterface } from 'src/categories/interfaces/categories.interface';
import { MatchInterface } from './interfaces/match.interface';

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
  async createChallenge(@Body() challenge: CreateChallengesDTO): Promise<void> {
    // Verificar se os jogadores estão cadastrados
    const players: PlayerInterface[] = await firstValueFrom(
      this.clientAdminBackend.send('consultar-jogador', ''),
    );

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

    const category: CategoriesInterface = await firstValueFrom(
      this.clientAdminBackend.send('pegar-categoria', challenge.category),
    );

    if (!category) throw new NotFoundException('Categoria não encontrada');

    this.clientChllenges.emit('criar-desafio', challenge);
  }

  // Consultar desafios de um jogador
  @Get()
  async getCategories(@Query('idplayer') idplayer: string): Promise<any> {
    if (idplayer) {
      const player: PlayerInterface = await firstValueFrom(
        this.clientAdminBackend.send('consultar-jogador', idplayer),
      );
      this.logger.log(JSON.stringify(player));
      if (!player) throw new NotFoundException('Jogador não encontrado');
    }

    /*
      ** Regras do endpoint do topico "consultar-desafio" **

      - Se preencher o idplayer a consulta será pelo id do jogador
      - Se preencher o _id a consulta será pelo id do desafio
      - Se não preencher nada retorna todos os desafios
    */

    return await lastValueFrom(
      this.clientChllenges.send('consultar-desafio', {
        idplayer: idplayer,
        _id: '',
      }),
    );
  }

  @Put(':idchallenge')
  async updateChallenge(
    @Param('idchallenge') idchallenge: string,
    @Body() challengeBody: UpdateChallengeDTO,
  ) {
    const challenge: ChallengeInterface = await firstValueFrom(
      this.clientChllenges.send('consultar-desafio', {
        idplayer: '',
        _id: idchallenge,
      }),
    );

    if (!challenge) throw new NotFoundException('Desafio não encontrado');

    if (challenge.status != ChallengeStatus.PENDENTE)
      throw new BadRequestException(
        'Os desafios só podem ser atualizados se ainda estiverem com status pendente',
      );

    await this.clientChllenges
      .emit('atualizar-desafio', {
        idchallenge,
        challengeBody,
      })
      .toPromise();
  }

  @Post(':challengeId/macth')
  async assignChallengeToMatch(
    @Param('challengeId') challengeId: string,
    @Body() challengeToMatch: AddChallengeForMatch,
  ) {
    const challenge: ChallengeInterface = await firstValueFrom(
      this.clientChllenges.send('consultar-desafio', {
        idplayer: '',
        _id: challengeId,
      }),
    );

    if (!challenge) throw new NotFoundException('Desafio não encontrado');

    if (challenge.status == ChallengeStatus.REALIZADO)
      throw new BadRequestException(
        'Não se pode associar desafios já realizados à partidas',
      );

    if (challenge.status !== ChallengeStatus.ACEITO)
      throw new BadRequestException(
        'Somente desafios aceitos podem ser acoessiados à partidas',
      );

    /*
     Cria o objeto partida a partir das informações recebidas, automatiizando tuo
     */

    const match: MatchInterface = {};
    match.category = challenge.category;
    match.def = challengeToMatch.def;
    match.challenge = challengeId;
    match.players = challenge.players;
    match.result = challengeToMatch.result;

    /*
      Envia a partida para o tópico "criar-partida"
      responsável por atribui a partida ao banco
    */

    await this.clientChllenges.emit('criar-partida', match).toPromise();
  }

  @Delete(':idchallenge')
  async deleteChallenge(@Param('idchallenge') idchallenge: string) {
    const challenge: ChallengeInterface = await firstValueFrom(
      this.clientChllenges.send('consultar-denoAck: false,safio', idchallenge),
    );

    if (!challenge) throw new NotFoundException('Desafio não encontrado');

    this.clientChllenges.emit('deletar-desafio', idchallenge);
  }
}
