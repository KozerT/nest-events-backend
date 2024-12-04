import { IsEnum } from 'class-validator';
import { AttendeesAnswerEnum } from '../attendee.entity';

export class CreateAttendeeDto {
  @IsEnum(AttendeesAnswerEnum)
  answer: AttendeesAnswerEnum;
}
