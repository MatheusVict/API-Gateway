import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateCategoryDTO {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description: string;

  @IsArray()
  @ArrayMinSize(1)
  events: Array<Event>;
}

export interface Event {
  name: string;
  operetion: string;
  value: string;
}
