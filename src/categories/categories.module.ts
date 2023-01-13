import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { ProxymqModule } from 'src/proxymq/proxymq.module';
import { CategoriesService } from './categories.service';

@Module({
  imports: [ProxymqModule],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
