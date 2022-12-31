import { Injectable, Logger } from '@nestjs/common';
import * as AWS from 'aws-sdk';

@Injectable()
export class AwsS3Service {
  private readonly logger = new Logger(AwsS3Service.name);

  async uploadFile(file: any, id: string) {
    const s3 = new AWS.S3({
      region: process.env.AWS_S3_REGION_SERVER,
      accessKeyId: process.env.AWS_S3_ACESS_KEY_ID,
      secretAccessKey: process.env.AWS_S3_SECRET_KEY,
      //Vai salvar no bucket o id do player.o tipo do arquivo
    });

    const fileSplited = file.originalname.split('.');
    const fileExtension = fileSplited[fileSplited.length - 1]; //Jogada inteligente. Pegar a extensão do arquivo

    const urlKey = `${id}.${fileExtension}`;

    this.logger.log(urlKey);

    const putObjectParams = {
      Body: file.buffer,
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: urlKey,
    };

    const data = s3
      .putObject(putObjectParams)
      .promise()
      .then(() => {
        return {
          //Url dos arquivos S3: https://{NameBuket}.s3.{region}.amazonaws.com/{NameFile.extesion}
          url: `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION_SERVER}.amazonaws.com/${urlKey}`,
        };
      })
      .catch((err) => {
        this.logger.error(err);
        return err;
      });
    return data;
  }
}
