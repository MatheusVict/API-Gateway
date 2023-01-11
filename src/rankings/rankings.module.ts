import { Module } from '@nestjs/common';
import { RankingsController } from './rankings.controller';
import { ProxymqModule } from 'src/proxymq/proxymq.module';

@Module({
  imports: [ProxymqModule],
  controllers: [RankingsController],
})
export class RankingsModule {}
