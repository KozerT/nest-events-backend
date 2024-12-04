import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendee } from './attendee.entity';
import { Injectable } from '@nestjs/common';
import { CreateAttendeeDto } from './input/create-attendee-dto';

@Injectable()
export class AttendeesService {
  constructor(
    @InjectRepository(Attendee)
    private readonly attendeesRepository: Repository<Attendee>,
  ) {}

  public async findEventById(eventId: number): Promise<Attendee[]> {
    return await this.attendeesRepository.findBy({ event: { id: eventId } });
  }

  public async findOneByEventIdAndUserId(
    eventId: number,
    userId: number,
  ): Promise<Attendee | undefined> {
    return await this.attendeesRepository.findOne({
      where: {
        event: { id: eventId },
        user: { id: userId },
      },
    });
  }

  public async createOrUpdate(
    input: CreateAttendeeDto,
    eventId: number,
    userId: number,
  ): Promise<Attendee> {
    const attendee =
      (await this.findOneByEventIdAndUserId(eventId, userId)) ?? new Attendee();
    attendee.eventId = eventId;
    attendee.userId = userId;
    attendee.answer = input.answer;

    //rest of input properties

    return await this.attendeesRepository.save(attendee);
  }
}
