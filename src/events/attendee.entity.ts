import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Event } from './event.entity';
import { Expose } from 'class-transformer';
import { User } from 'src/auth/user.entity';

export enum AttendeesAnswerEnum {
  Accepted = 1,
  Maybe,
  Rejected,
}

@Entity()
export class Attendee {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number;

  @Column()
  @Expose()
  name: string;

  @ManyToOne(() => Event, (event) => event.attendees, {
    nullable: false,
  })
  @JoinColumn()
  event: Event;

  @Column()
  eventId: number;

  @Column('enum', {
    enum: AttendeesAnswerEnum,
    default: AttendeesAnswerEnum.Maybe,
  })
  answer: AttendeesAnswerEnum;
  @ManyToOne(() => User, (user) => user.attended)
  user: User;

  @Column()
  userId: number;
}
