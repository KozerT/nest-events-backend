import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Attendee } from './attendee.entity';

export class AttendeesService {
  constructor(
    @InjectRepository(Attendee)
    private readonly attendeesRepository: Repository<Attendee>,
  ) {}

  public async findEventById(eventId: number): Promise<Attendee[]> {
    return await this.attendeesRepository.findBy({ event: { id: eventId } });
  }
}
