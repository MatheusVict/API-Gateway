import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ClientProxySmartRanking } from 'src/proxymq/client-proxy.proxymq';

@Injectable()
export class RankingsService {
  constructor(
    private readonly clientProxySmartRanking: ClientProxySmartRanking,
  ) {}

  private clientRankings =
    this.clientProxySmartRanking.getClientProxyRankingInstance();

  private readonly logger = new Logger(RankingsService.name);

  async getRankings(
    idCategory: string,
    dataRef: string,
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
