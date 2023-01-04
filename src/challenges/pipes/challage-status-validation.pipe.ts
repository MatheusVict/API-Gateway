import { BadRequestException, PipeTransform } from '@nestjs/common';
import { ChallengeStatus } from '../interfaces/challenge-status.enum';

export class ChallengeValidationPipe implements PipeTransform {
  readonly statusAccepted = [
    ChallengeStatus.ACEITO,
    ChallengeStatus.NEGADO,
    ChallengeStatus.CANCELADO,
  ];

  transform(value: any) {
    const status = value.status.toUpperCase();

    if (!this.isStatusValide(status))
      throw new BadRequestException(`${status} não é um status válido`);

    return value;
  }

  private isStatusValide(status: any) {
    const index = this.statusAccepted.indexOf(status);

    return index !== -1;
  }
}
