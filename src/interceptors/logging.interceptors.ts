import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable() // Porque vai ser um provider
export class LoggingInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    console.log('antes');
    const now = Date.now();

    return next
      .handle()
      .pipe(tap(() => console.log('Depois', Date.now() - now)));
    /*tap causa um efeito colateral toda vez q recebe um pacote de obsevable 
    sem afetar o valor passado pra funcção subsquente*/
  }
}
