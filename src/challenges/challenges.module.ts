import { Module } from '@nestjs/common';
import { ChallengesController } from './challenges.controller';
import { ProxymqModule } from 'src/proxymq/proxymq.module';

@Module({
  imports: [ProxymqModule],
  controllers: [ChallengesController],
})
export class ChallengesModule {}
