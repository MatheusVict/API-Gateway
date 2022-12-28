import { Module } from '@nestjs/common';
import { PlayersController } from './players.controller';
import { ProxymqModule } from 'src/proxymq/proxymq.module';

@Module({
  imports: [ProxymqModule],
  controllers: [PlayersController],
})
export class PlayersModule {}
