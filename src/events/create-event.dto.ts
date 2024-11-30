import { IsDateString, IsString, Length } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @Length(2, 255, { message: 'Name must be between 2 and 255 characters' })
  name: string;
  @Length(2, 255, { message: 'Name must be between 2 and 255 characters' })
  description: string;
  @IsDateString()
  when: string;
  @IsString()
  @Length(2, 255)
  address: string;
}
