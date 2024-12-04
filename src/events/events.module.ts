import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsController } from './events.controller';
import { Event } from './event.entity';
import { Attendee } from './attendee.entity';
import { EventsService } from './events.service';
import { AttendeesService } from './attendees.service';
import { EventsOrganizedByUserController } from './events-organized-by-user.controller';
import { CurrentUserEventAttendanceController } from './current-user-event-attendance.controller';
import { EventsAttendeesController } from './event-atendees-controller';

@Module({
  imports: [TypeOrmModule.forFeature([Event, Attendee])],
  controllers: [
    EventsController,
    EventsOrganizedByUserController,
    EventsAttendeesController,
    CurrentUserEventAttendanceController,
  ],
  providers: [EventsService, AttendeesService],
})
export class EventsModule {}
