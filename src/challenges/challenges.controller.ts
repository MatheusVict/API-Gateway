import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateChallengesDTO } from './dto/create-challenges.dto';
import { UpdateChallengeDTO } from './dto/update-challenge.dto';
import { AddChallengeForMatch } from './dto/add-player-for-match.dto';
import { ChallengesService } from './challenges.service';

@Controller('challenges')
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  private readonly logger = new Logger(ChallengesController.name);

  @Post()
  async createChallenge(@Body() challenge: CreateChallengesDTO): Promise<void> {
    await this.challengesService.createChallenge(challenge);
  }

  // Consultar desafios de um jogador
  @Get()
  async getCategories(@Query('idplayer') idplayer: string): Promise<any> {
    return await this.challengesService.getCategories(idplayer);
  }

  @Put(':idchallenge')
  async updateChallenge(
    @Param('idchallenge') idchallenge: string,
    @Body() challengeBody: UpdateChallengeDTO,
  ) {
    await this.challengesService.updateChallenge(idchallenge, challengeBody);
  }

  @Post(':challengeId/macth')
  async assignChallengeToMatch(
    @Param('challengeId') challengeId: string,
    @Body() challengeToMatch: AddChallengeForMatch,
  ) {
    await this.challengesService.assignChallengeToMatch(
      challengeId,
      challengeToMatch,
    );
  }

  @Delete(':idchallenge')
  async deleteChallenge(@Param('idchallenge') idchallenge: string) {
    await this.challengesService.deleteChallenge(idchallenge);
  }
}
