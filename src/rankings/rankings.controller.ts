import {
  BadRequestException,
  Controller,
  Get,
  Logger,
  Query,
} from '@nestjs/common';
import { Observable, firstValueFrom } from 'rxjs';
import { ClientProxySmartRanking } from 'src/proxymq/client-proxy.proxymq';

@Controller('rankings')
export class RankingsController {
  constructor(
    private readonly clientProxySmartRanking: ClientProxySmartRanking,
  ) {}

  private clientRankings =
    this.clientProxySmartRanking.getClientProxyRankingInstance();

  private readonly logger = new Logger(RankingsController.name);

  @Get()
  async getRankings(
    @Query('idCategory') idCategory: string,
    @Query('dataRef') dataRef: string,
  ): Promise<any> /*Data de referência para consulta do ranking */ {
    if (!idCategory) {
      throw new BadRequestException('O id da categoria é obrigatório');
    }

    return await this.clientRankings
      .send('consultar-rankings', {
        idCategory: idCategory,
        dataRef: dataRef ? dataRef : '',
      })
      .toPromise();
  }
}
