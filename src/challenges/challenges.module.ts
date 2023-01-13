import { Module } from '@nestjs/common';
import { ChallengesController } from './challenges.controller';
import { ProxymqModule } from 'src/proxymq/proxymq.module';
import { ChallengesService } from './challenges.service';

@Module({
  imports: [ProxymqModule],
  controllers: [ChallengesController],
  providers: [ChallengesService],
})
export class ChallengesModule {}
