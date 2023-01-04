import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsNotEmpty,
} from 'class-validator';
import { PlayerInterface } from 'src/players/interfaces/player.interface';

export class CreateChallengesDTO {
  @IsNotEmpty()
  @IsDateString()
  DateTimeChallenge: Date;

  @IsNotEmpty()
  requester: string;

  @IsNotEmpty()
  category: string;

  @IsArray()
  @ArrayMaxSize(2)
  @ArrayMinSize(2)
  players: PlayerInterface[];
}
