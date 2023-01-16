import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateCategoryDTO } from './dtos/create-category.dto';
import { UpdateCategoryDTO } from './dtos/update-category.dto';
import { CategoriesService } from './categories.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  async createCategory(@Body() createCategoryDTO: CreateCategoryDTO) {
    await this.categoriesService.createCategory(createCategoryDTO);
    // Retorna um hot obeservable, msm q a gente não s inscreva o core do nest vai tentar entregar o evento
  }

  @Get()
  async getOneCategory(@Query('idCategory') idCategory: string) {
    return await this.categoriesService.getOneCategory(idCategory);
  }

  @Put(':id')
  async updateCategories(
    @Param('id') id: string,
    @Body() updateDto: UpdateCategoryDTO,
  ) {
    await this.categoriesService.updateCategories(id, updateDto);
  }

  @Delete(':id')
  async deleteCategory(@Param('id') id: string) {
    await this.categoriesService.deleteCategory(id);
  }
}
