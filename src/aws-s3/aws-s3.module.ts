import { Module } from '@nestjs/common';
import { AwsS3Service } from './aws-s3.service';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  providers: [AwsS3Service],
  exports: [AwsS3Service],
})
export class AwsS3Module {}
