import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreatePlayerDTO } from './dto/create-player.dto';
import { UpdatePlayerDTO } from './dto/update-player.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { PlayersService } from './players.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  private readonly logger = new Logger(PlayersController.name);

  @Post()
  async createPlayer(@Body() data: CreatePlayerDTO) {
    this.logger.log(`createPLayer: ${JSON.stringify(data)}`);
    await this.playersService.createPlayer(data);
  }

  /* Feature add picture for player */
  @UseGuards(AuthGuard('jwt'))
  @Post(':id/upload')
  @UseInterceptors(FileInterceptor('file')) // 2 argumentos string com o nome do campo do formulario q vai conter o arquivo
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
  ) {
    return await this.playersService.uploadFile(file, id);
  }
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findCategories(@Query('idplayer') idplayer: string): Promise<any> {
    return await this.playersService.findCategories(idplayer);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async updatePlayer(@Param('id') id: string, @Body() body: UpdatePlayerDTO) {
    await this.playersService.updatePlayer(id, body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async deletePlayer(@Param('id') id: string) {
    await this.playersService.deletePlayer(id);
  }
}
