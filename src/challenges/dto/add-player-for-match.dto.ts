import { IsNotEmpty } from 'class-validator';
import { PlayerInterface } from 'src/players/interfaces/player.interface';
import { Result } from '../interfaces/match.interface';

export class AddPlayerForMatch {
  @IsNotEmpty()
  def: PlayerInterface;

  @IsNotEmpty()
  result: Array<Result>;
}
