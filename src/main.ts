import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExecptionsFilter } from './common/filters/http-execption-filter';
import * as momentTimeZone from 'moment-timezone';
import { LoggingInterceptor } from './common/interceptors/logging.interceptors';
import { TimeOutInterceptor } from './common/interceptors/timeout.interceptor';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new AllExecptionsFilter());

  app.useGlobalInterceptors(new LoggingInterceptor(), new TimeOutInterceptor()); // Intercepta as requisições

  app.useGlobalPipes(new ValidationPipe());

  Date.prototype.toJSON = function (): any {
    return momentTimeZone(this)
      .tz('America/Sao_Paulo')
      .format('YYYY-MM-DD HH:mm:ss.SSS');
  };
  await app.listen(8081);
}
bootstrap();
