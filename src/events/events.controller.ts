import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
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

@Controller('/events')
export class EventsController {
  constructor(
    @InjectRepository(Event) // Injecting the Event entity repository
    private readonly repository: Repository<Event>,
  ) {}

  // Simulating a database
  @Get()
  async findAll() {
    return await this.repository.find();
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
  @Get('/:id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.repository.findOneBy({ id: id });
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
    const eventIndex = await this.repository.findOneBy({ id: id });
    return await this.repository.save({
      ...eventIndex,
      ...input,
      when: input.when ? new Date(input.when) : eventIndex.when,
    });
  }
  @Delete('/:id')
  @HttpCode(204)
  async remove(@Param('id') id) {
    const event = await this.repository.findOneBy({ id: id });
    await this.repository.remove(event);
  }
}
