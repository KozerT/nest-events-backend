import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Profile } from './profile.entity';
import { Event } from 'src/events/event.entity';
import { Expose } from 'class-transformer';
import { Attendee } from 'src/events/attendee.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number;
  @Column({ unique: true })
  @Expose()
  username: string;
  @Column()
  password: string;
  @Column({ unique: true })
  @Expose()
  email: string;
  @Column()
  @Expose()
  firstName: string;
  @Column()
  @Expose()
  lastName: string;

  //Define the one-to-one relationship relation between User and Profile
  @OneToOne(() => Profile)
  // Define the foreign key column linking to the this entity
  @JoinColumn()
  @Expose()
  profile: Profile;

  @OneToMany(() => Event, (event) => event.organizer)
  @Expose()
  organized: Event[];
  // Define the one-to-many relationship relation between User and Event , taking he Attendee type and point out to the user entity
  @OneToMany(() => Attendee, (attendee) => attendee.event)
  attended: Attendee[];
}
