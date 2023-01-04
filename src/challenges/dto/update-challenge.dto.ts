import { IsOptional } from 'class-validator';
import { ChallengeStatus } from '../interfaces/challenge-status.enum';

export class UpdateChallengeDTO {
  @IsOptional()
  status: ChallengeStatus;
}
