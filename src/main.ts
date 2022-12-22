import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExecptionsFilter } from './filters/http-execption-filter';
import * as momentTimeZone from 'moment-timezone';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new AllExecptionsFilter());

  Date.prototype.toJSON = function (): any {
    return momentTimeZone(this)
      .tz('America/Sao_Paulo')
      .format('YYYY-MM-DD HH:mm:ss.SSS');
  };
  await app.listen(8080);
}
bootstrap();
