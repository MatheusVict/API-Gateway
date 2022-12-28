import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { ProxymqModule } from 'src/proxymq/proxymq.module';

@Module({
  imports: [ProxymqModule],
  controllers: [CategoriesController],
})
export class CategoriesModule {}
