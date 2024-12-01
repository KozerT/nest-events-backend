import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Profile } from './profile.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  username: string;
  @Column()
  password: string;
  @Column()
  email: string;
  @Column()
  firstName: string;
  @Column()
  lastName: string;

  //Define the one-to-one relationship relation between User and Profile
  @OneToOne(() => Profile)
  // Define the foreign key column linking to the this entity
  @JoinColumn()
  profile: Profile;
}
