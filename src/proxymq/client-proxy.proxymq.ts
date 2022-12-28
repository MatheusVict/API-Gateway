import { Injectable } from '@nestjs/common';
import {
  ClientProxy,
  Transport,
  ClientProxyFactory,
} from '@nestjs/microservices';

@Injectable()
export class ClientProxySmartRanking {
  //Conexão universal com a aplicação
  getClientProxyAdminBackendInstance(): ClientProxy {
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [process.env.AWS_RABBITMQ],
        queue: 'admin-backend',
      },
    });
  }
}
