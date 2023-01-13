import { Injectable } from '@nestjs/common';
import { ClientProxySmartRanking } from 'src/proxymq/client-proxy.proxymq';
import { CreateCategoryDTO } from './dtos/create-category.dto';
import { UpdateCategoryDTO } from './dtos/update-category.dto';
import { firstValueFrom, lastValueFrom } from 'rxjs';

@Injectable()
export class CategoriesService {
  constructor(private clientProxySmartRamking: ClientProxySmartRanking) {}

  private clientAdminBackend =
    this.clientProxySmartRamking.getClientProxyAdminBackendInstance();

  async createCategory(createCategoryDTO: CreateCategoryDTO) {
    this.clientAdminBackend.emit('criar-categoria', createCategoryDTO);
    // Retorna um hot obeservable, msm q a gente não s inscreva o core do nest vai tentar entregar o evento
  }

  async getOneCategory(idCategory: string): Promise<any> {
    return await firstValueFrom(
      this.clientAdminBackend.send(
        //Retorna um cold observable se inscreve explicitamente antes de enviar
        'pegar-categoria',
        idCategory ? idCategory : '',
      ),
    ); //Request/Response
  }

  async updateCategories(id: string, updateDto: UpdateCategoryDTO) {
    await lastValueFrom(
      this.clientAdminBackend.emit('atualizar-categoria', {
        id,
        category: updateDto,
      }),
    );
  }

  async deleteCategory(id: string) {
    await lastValueFrom(this.clientAdminBackend.emit('apagar-categoria', id));
  }
}
