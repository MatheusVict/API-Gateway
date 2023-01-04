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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ClientProxySmartRanking } from 'src/proxymq/client-proxy.proxymq';
import { CreatePlayerDTO } from './dto/create-player.dto';
import { Observable, firstValueFrom } from 'rxjs';
import { UpdatePlayerDTO } from './dto/update-player.dto';
import { lastValueFrom } from 'rxjs';
import { FileInterceptor } from '@nestjs/platform-express';
import { AwsS3Service } from 'src/aws-s3/aws-s3.service';

@Controller('players')
export class PlayersController {
  constructor(
    private clientProxySmartRamking: ClientProxySmartRanking,
    private awsS3Service: AwsS3Service,
  ) {}

  private readonly logger = new Logger(PlayersController.name);

  private clientAdminBackend =
    this.clientProxySmartRamking.getClientProxyAdminBackendInstance();

  @Post()
  async createPlayer(@Body() data: CreatePlayerDTO) {
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
  @Post(':id/upload')
  @UseInterceptors(FileInterceptor('file')) // 2 argumentos string com o nome do campo do formulario q vai conter o arquivo
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
  ) {
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
    return this.clientAdminBackend.send('consultar-jogador', id);
  }

  @Get()
  findCategories(@Query('idplayer') idplayer: string): Observable<any> {
    return this.clientAdminBackend.send(
      'consultar-jogador',
      idplayer ? idplayer : '',
    );
  }

  @Put(':id')
  async updatePlayer(@Param('id') id: string, @Body() body: UpdatePlayerDTO) {
    const category = await lastValueFrom(
      this.clientAdminBackend.send('pegar-categoria', body.category),
    );

    if (category)
      this.clientAdminBackend.emit('atualizar-jogador', { id, body });
    else throw new BadRequestException('Categoria não encontrada');
  }

  @Delete(':id')
  async deletePlayer(@Param('id') id: string) {
    this.clientAdminBackend.emit('deletar-jogador', id);
  }
}
