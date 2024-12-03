import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common';
import { EventsService } from './events.service';

@Controller('events-organized-by-user/userId')
@SerializeOptions({ strategy: 'excludeAll' })
export class EventsOrganizedByUserController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor) // This will automatically serialize the returned
  async findAll(
    @Param('userId') userId: number,
    @Query('page', new ParseIntPipe({ optional: true })) page = 1,
  ) {
    return await this.eventsService.getEventsOrganizedByUserIdPaginated(
      userId,
      { currentPage: page, limit: 5 },
    );
  }
}
