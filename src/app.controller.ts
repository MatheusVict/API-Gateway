import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { CreateCategoryDTO } from './dtos/create-category.dto';
import { Observable } from 'rxjs';

@Controller('api/v1/category')
export class AppController {
  private readonly logger = new Logger(AppController.name);

  private clientAdminBackend: ClientProxy;

  constructor() {
    this.clientAdminBackend = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [process.env.AWS_RABBITMQ],
        queue: 'admin-backend',
      },
    });
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createCategory(@Body() createCategoryDTO: CreateCategoryDTO) {
    this.clientAdminBackend.emit('criar-categoria', createCategoryDTO);
    // Retorna um hot obeservable, msm q a gente não s inscreva o core do nest vai tentar entregar o evento
  }

  @Get()
  getOneCategory(@Query('idCategory') idCategory: string): Observable<any> {
    return this.clientAdminBackend.send(
      //Retorna um cold observable se inscreve explicitamente antes de enviar
      'pegar-categoria',
      idCategory ? idCategory : '',
    ); //Request/Response
  }
}
