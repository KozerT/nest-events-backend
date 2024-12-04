import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { Event } from './event.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, MoreThan, Repository } from 'typeorm';
import { Attendee } from './attendee.entity';
import { EventsService } from './events.service';
import { UpdateEventDto } from './input/update-event.dto';
import { CreateEventDto } from './input/create-event.dto';
import { ListEvents } from './input/list.events';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { User } from 'src/auth/user.entity';
import { AuthGuardJwt } from 'src/auth/auth-guard.jwt';

// Only one thing controllers should do getting the input from the user and returning the response
@Controller('/events')
@SerializeOptions({ strategy: 'excludeAll' })
export class EventsController {
  private readonly logger = new Logger(EventsController.name);

  constructor(
    @InjectRepository(Event) // Injecting the Event entity repository
    private readonly repository: Repository<Event>,
    @InjectRepository(Attendee) // Injecting the Attendee entity repository
    private readonly attendeeRepository: Repository<Attendee>,

    private readonly eventService: EventsService, // Injecting the EventsService
  ) {}

  // Simulating a database
  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll(@Query() filter: ListEvents) {
    try {
      this.logger.log('Fetching all events');
      const events =
        await this.eventService.getEventsWithAttendeeCountFilteredPaginated(
          filter,
          { total: true, currentPage: filter.page, limit: 10 },
        );
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
    const event = await this.repository.findOne({
      where: { id: 1 },
      relations: ['attendees'],
    });
    event.id = 1;
    const attendee = new Attendee();
    attendee.name = 'Elisabeth';

    event.attendees.push(attendee);

    return await this.repository.save(event);
  }

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const event = await this.eventService.getEventWithAttendeeCount(id);

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    return event;
  }
  @Post()
  @UseGuards(AuthGuardJwt)
  @UseInterceptors(ClassSerializerInterceptor)
  async create(@Body() input: CreateEventDto, @CurrentUser() user: User) {
    return await this.eventService.createEvent(input, user);
  }

  @Patch(':id')
  @UseGuards(AuthGuardJwt)
  @UseInterceptors(ClassSerializerInterceptor)
  async update(
    @Param('id', ParseIntPipe) id,
    @Body() input: UpdateEventDto,
    @CurrentUser() user: User,
  ) {
    const event = await this.eventService.findOne(id);
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    if (event.organizerId !== user.id) {
      throw new ForbiddenException(null, 'Unauthorized to update this event');
    }

    return await this.eventService.updateEvent(id, input);
  }
  @Delete('/:id')
  @UseGuards(AuthGuardJwt)
  @HttpCode(204)
  async remove(@Param('id', ParseIntPipe) id, @CurrentUser() user: User) {
    const event = await this.eventService.findOne(id);

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    if (event.organizerId !== user.id) {
      throw new ForbiddenException(null, 'Unauthorized to delete this event');
    }

    await this.eventService.deleteEvent(id);
  }
}
