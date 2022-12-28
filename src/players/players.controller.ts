import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ClientProxySmartRanking } from 'src/proxymq/client-proxy.proxymq';
import { CreatePlayerDTO } from './dto/create-player.dto';
import { Observable } from 'rxjs';
import { UpdatePlayerDTO } from './dto/update-player.dto';
import { lastValueFrom } from 'rxjs';

@Controller('players')
export class PlayersController {
  constructor(private clientProxySmartRamking: ClientProxySmartRanking) {}

  private readonly logger = new Logger(PlayersController.name);

  private clientAdminBackend =
    this.clientProxySmartRamking.getClientProxyAdminBackendInstance();

  @Post()
  async createPlayer(@Body() data: CreatePlayerDTO) {
    this.logger.log(`createPLayer: ${JSON.stringify(data)}`);
    /*const category = await lastValueFrom(
      this.clientAdminBackend.send('pegar-categoria', data.category),
    );*/

    const category = await this.clientAdminBackend
      .send('pegar-categoria', data.category)
      .toPromise();

    if (category) this.clientAdminBackend.emit('criar-jogador', data);
    else throw new BadRequestException('Categoria não encontrada');
  }

  @Get()
  findCategories(@Query('idplayer') idplayer: string): Observable<any> {
    return this.clientAdminBackend.send(
      'consultar-jogador',
      idplayer ? idplayer : '',
    );
  }

  @Put(':id')
  async updatePlayer(@Param('id') id: string, @Body() data: UpdatePlayerDTO) {
    const category = await this.clientAdminBackend
      .send('pegar-categoria', data.category)
      .toPromise();

    if (category)
      this.clientAdminBackend.emit('atualizar-jogador', { id, data });
    else throw new BadRequestException('Categoria não encontrada');
  }

  @Delete(':id')
  async deletePlayer(@Param('id') id: string) {
    this.clientAdminBackend.emit('deletar-jogador', id);
  }
}
