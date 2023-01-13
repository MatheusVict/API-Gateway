import { Module } from '@nestjs/common';
import { RankingsController } from './rankings.controller';
import { ProxymqModule } from 'src/proxymq/proxymq.module';
import { RankingsService } from './rankings.service';

@Module({
  imports: [ProxymqModule],
  controllers: [RankingsController],
  providers: [RankingsService],
})
export class RankingsModule {}
