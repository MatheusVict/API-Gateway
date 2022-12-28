import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

@Catch()
export class AllExecptionsFilter implements ExceptionFilter {
  // Um tratamento de erro global(quase um middlawere)
  private readonly logger = new Logger(AllExecptionsFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException ? exception.getResponse() : exception;
    // Como o mongoose não retorna no error um httpExection, eu retorno próprio execption recebido pelo mongosee

    this.logger.error(
      `Htpp Status: ${status} Error Message: ${JSON.stringify(message)}`, //Tem q converter pra string
    );

    response.status(status).json({
      timestamp: new Date().toISOString(),
      path: request.url,
      error: message,
    });
  }
}
