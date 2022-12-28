import { Module } from '@nestjs/common';
import { ClientProxySmartRanking } from './client-proxy.proxymq';

@Module({
  imports: [],
  providers: [ClientProxySmartRanking],
  exports: [ClientProxySmartRanking],
})
export class ProxymqModule {}
