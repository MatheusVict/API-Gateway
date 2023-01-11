import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { CategoriesModule } from './categories/categories.module';
import { PlayersModule } from './players/players.module';
import { ProxymqModule } from './proxymq/proxymq.module';
import { AwsS3Module } from './aws-s3/aws-s3.module';
import { ChallengesModule } from './challenges/challenges.module';
import { MulterModule } from '@nestjs/platform-express';
import { RankingsModule } from './rankings/rankings.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MulterModule.register({
      dest: './uploads',
    }),
    CategoriesModule,
    PlayersModule,
    ProxymqModule,
    AwsS3Module,
    ChallengesModule,
    RankingsModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
