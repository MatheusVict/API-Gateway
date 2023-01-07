import { PlayerInterface } from 'src/players/interfaces/player.interface';
import { ChallengeStatus } from './challenge-status.enum';

export interface ChallengeInterface {
  DateTimeChallenge: Date;
  status: ChallengeStatus;
  DateTimeRequest: Date;
  requester: PlayerInterface;
  category: string;
  match?: string;
  players: Array<PlayerInterface>;
}
