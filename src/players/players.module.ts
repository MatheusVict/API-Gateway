import { Module } from '@nestjs/common';
import { PlayersController } from './players.controller';
import { ProxymqModule } from 'src/proxymq/proxymq.module';
import { AwsS3Module } from 'src/aws-s3/aws-s3.module';
import { MulterModule } from '@nestjs/platform-express';
import { PlayersService } from './players.service';

@Module({
  imports: [
    ProxymqModule,
    AwsS3Module,
    MulterModule.register({ dest: './uploads' }),
  ],
  controllers: [PlayersController],
  providers: [PlayersService],
})
export class PlayersModule {}
