import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Teacher } from './teacher.entity';

@Entity()
export class Subject {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => Teacher, (teacher) => teacher.subjects, { cascade: true })
  @JoinTable()
  //   {
  //   joinColumn: { name: 'subjectId', referencedColumnName: 'id' },
  //   inverseJoinColumn: { name: 'teacherId', referencedColumnName: 'id' },
  // }
  teachers: Teacher[];
}
