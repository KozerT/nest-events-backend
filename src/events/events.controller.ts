import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateEventDto } from './create-event.dto';
import { UpdateEventDto } from './update-event.dto';
import { Event } from './event.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, MoreThan, Repository } from 'typeorm';
import { Attendee } from './attendee.entity';

@Controller('/events')
export class EventsController {
  private readonly logger = new Logger(EventsController.name);

  constructor(
    @InjectRepository(Event) // Injecting the Event entity repository
    private readonly repository: Repository<Event>,
    @InjectRepository(Attendee) // Injecting the Attendee entity repository
    private readonly attendeeRepository: Repository<Attendee>,
  ) {}

  // Simulating a database
  @Get()
  async findAll() {
    try {
      this.logger.log('Fetching all events');
      const events = await this.repository.find();
      this.logger.debug(`Found ${events.length} events`);
      return events;
    } catch (error) {
      this.logger.error('Error fetching all events', error); // Log the error for debugging
      throw new InternalServerErrorException('Failed to fetch events'); // Re-throw as a 500 error
    }
  }

  @Get('/practice')
  async practice() {
    return await this.repository.find({
      select: ['id', 'when'],
      where: [
        {
          id: MoreThan(3),
          when: MoreThan(new Date('2021-02-12T13:00:00')),
        },
        {
          description: Like('%meet%'),
        },
      ],
      take: 2,
      order: {
        id: 'DESC',
      },
    });
  }

  @Get('practice2')
  async practice2() {
    // return await this.repository.findOne({
    //   where: { id: 1 },
    //   relations: ['attendees'],
    // });
    const event = await this.repository.findOne({
      where: { id: 1 },
      relations: ['attendees'],
    });
    event.id = 1;
    const attendee = new Attendee();
    attendee.name = 'Elisabeth';
    // attendee.event = event;

    event.attendees.push(attendee);

    // return await this.attendeeRepository.save(attendee);
    return await this.repository.save(event);
  }
  @Get('/:id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const event = await this.repository.findOneBy({ id: id });

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
  }
  @Post()
  async create(@Body() input: CreateEventDto) {
    return await this.repository.save({
      ...input,
      when: new Date(input.when),
    });
  }

  @Patch(':id')
  async update(@Param('id') id, @Body() input: UpdateEventDto) {
    const event = await this.repository.findOneBy({ id: id });
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return await this.repository.save({
      ...event,
      ...input,
      when: input.when ? new Date(input.when) : event.when,
    });
  }
  @Delete('/:id')
  @HttpCode(204)
  async remove(@Param('id') id) {
    const event = await this.repository.findOneBy({ id: id });
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    await this.repository.remove(event);
  }
}
