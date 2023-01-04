import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AwsS3Service {
  private readonly logger = new Logger(AwsS3Service.name);

  async uploadFile(file: Express.Multer.File) {
    const objectPic = {
      urlPic: `http://localhost:8081/image/player/${file.filename}`,
      fileNameSaveInMemory: file.filename,
      size: `${file.size}KB`,
      originalName: file.originalname,
    };
    this.logger.log(JSON.stringify(objectPic));

    return objectPic;
  }
}
