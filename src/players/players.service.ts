import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { AwsS3Service } from 'src/aws-s3/aws-s3.service';
import { ClientProxySmartRanking } from 'src/proxymq/client-proxy.proxymq';
import { CreatePlayerDTO } from './dto/create-player.dto';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { UpdatePlayerDTO } from './dto/update-player.dto';

@Injectable()
export class PlayersService {
  constructor(
    private clientProxySmartRamking: ClientProxySmartRanking,
    private readonly awsS3Service: AwsS3Service,
  ) {}

  private readonly logger = new Logger(PlayersService.name);

  private clientAdminBackend =
    this.clientProxySmartRamking.getClientProxyAdminBackendInstance();

  async createPlayer(data: CreatePlayerDTO) {
    this.logger.log(`createPLayer: ${JSON.stringify(data)}`);
    const category = await firstValueFrom(
      this.clientAdminBackend.send('pegar-categoria', data.category),
    );

    /*const category = await this.clientAdminBackend
    .send('pegar-categoria', data.category)
    .toPromise();*/

    if (category) this.clientAdminBackend.emit('criar-jogador', data);
    else throw new BadRequestException('Categoria não encontrada');
  }

  /* Feature add picture for player */
  async uploadFile(file: Express.Multer.File, id: string): Promise<any> {
    //Verificar se o jogador realmente existe
    const player = await firstValueFrom(
      this.clientAdminBackend.send('consultar-jogador', id),
    );

    if (!player) throw new NotFoundException('Jogador não encontrado');

    //Enviar e recuperar a url de acesso
    const urlPicPlayer = await this.awsS3Service.uploadFile(file);

    //Atualizar o atributo url da Entidade player
    const updatePlayerDTO: UpdatePlayerDTO = {};
    updatePlayerDTO.urlPicPlayer = urlPicPlayer.urlPic;

    await lastValueFrom(
      this.clientAdminBackend.emit('atualizar-jogador', {
        id,
        body: updatePlayerDTO,
      }),
    );

    //Retornar o player atualizado
    return firstValueFrom(
      this.clientAdminBackend.send('consultar-jogador', id),
    );
  }

  async findCategories(idplayer: string): Promise<any> {
    return await firstValueFrom(
      this.clientAdminBackend.send(
        'consultar-jogador',
        idplayer ? idplayer : '',
      ),
    );
  }

  async updatePlayer(id: string, body: UpdatePlayerDTO) {
    const category = await lastValueFrom(
      this.clientAdminBackend.send('pegar-categoria', body.category),
    );

    if (category)
      this.clientAdminBackend.emit('atualizar-jogador', { id, body });
    else throw new BadRequestException('Categoria não encontrada');
  }

  async deletePlayer(id: string) {
    await lastValueFrom(this.clientAdminBackend.emit('deletar-jogador', id));
  }
}
