import { Module } from '@nestjs/common';
import { PlayersController } from './players.controller';
import { ProxymqModule } from 'src/proxymq/proxymq.module';
import { AwsS3Module } from 'src/aws-s3/aws-s3.module';

@Module({
  imports: [ProxymqModule, AwsS3Module],
  controllers: [PlayersController],
})
export class PlayersModule {}
