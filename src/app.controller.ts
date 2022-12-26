import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Put,
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
import { UpdateCategoryDTO } from './dtos/update-category.dto';

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

  @Put(':id')
  updateCategories(
    @Param('id') id: string,
    @Body() updateDto: UpdateCategoryDTO,
  ) {
    this.clientAdminBackend.emit('atualizar-categoria', {
      id,
      category: updateDto,
    });
  }
}
