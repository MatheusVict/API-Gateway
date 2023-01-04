import { PlayerInterface } from 'src/players/interfaces/player.interface';

export interface MatchInterface {
  category?: string;
  challenge?: string;
  players?: PlayerInterface[];
  def?: PlayerInterface;
  result: Result[];
}

export interface Result {
  set: string;
}
