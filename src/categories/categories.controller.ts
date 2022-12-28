import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateCategoryDTO } from './dtos/create-category.dto';
import { Observable } from 'rxjs';
import { UpdateCategoryDTO } from './dtos/update-category.dto';
import { ClientProxySmartRanking } from 'src/proxymq/client-proxy.proxymq';

@Controller('categories')
export class CategoriesController {
  constructor(private clientProxySmartRamking: ClientProxySmartRanking) {}

  private clientAdminBackend =
    this.clientProxySmartRamking.getClientProxyAdminBackendInstance();

  @Post()
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

  @Delete(':id')
  async deleteCategory(@Param('id') id: string) {
    this.clientAdminBackend.emit('apagar-categoria', id);
  }
}
