import {
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('api/v1/category')
export class AppController {
  private readonly logger = new Logger(AppController.name);

  @Post()
  @UseInterceptors(FileInterceptor('file')) // 2 argumentos string com o nome do campo do formulario q vai conter o arquivo
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    file.filename = 'ola.jpg';
    file.originalname = 'oi.jpg';
    console.log(file);
  }

  @Get(':img')
  fotos(@Param('img') image, @Res() res) {
    return res.sendFile(image, { root: 'uploads' });
  }
}
