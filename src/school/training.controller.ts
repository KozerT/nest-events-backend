import { Controller, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subject } from './subject.entity';
import { Teacher } from './teacher.entity';

@Controller('school')
export class TrainingController {
  constructor(
    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,
  ) {}

  @Post('/create')
  public async savingRelation() {
    const subject = await this.subjectRepository.findOneBy({ id: 3 });

    const teacher1 = await this.teacherRepository.findOneBy({ id: 5 });
    const teacher2 = await this.teacherRepository.findOneBy({ id: 7 });

    return await this.subjectRepository
      .createQueryBuilder()
      .relation(Subject, 'teachers')
      .of(subject)
      .add([teacher1, teacher2]);
  }

  @Post('/remove')
  public async removingRelation() {
    await this.subjectRepository
      .createQueryBuilder('s')
      .update()
      .set({
        name: 'Confidential',
      })
      .execute();
  }
}
