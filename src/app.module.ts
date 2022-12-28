import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { CategoriesModule } from './categories/categories.module';
import { PlayersModule } from './players/players.module';
import { ProxymqModule } from './proxymq/proxymq.module';

@Module({
  imports: [ConfigModule.forRoot(), CategoriesModule, PlayersModule, ProxymqModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
