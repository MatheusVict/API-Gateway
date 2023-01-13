import { Controller, Get, Logger, Query } from '@nestjs/common';
import { RankingsService } from './rankings.service';

@Controller('rankings')
export class RankingsController {
  constructor(private readonly rankingsService: RankingsService) {}

  private readonly logger = new Logger(RankingsController.name);

  @Get()
  async getRankings(
    @Query('idCategory') idCategory: string,
    @Query('dataRef') dataRef: string,
  ): Promise<any> /*Data de referência para consulta do ranking */ {
    return await this.rankingsService.getRankings(idCategory, dataRef);
  }
}
