import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { RoleModule } from 'src/role/role.module';
import { MongooseModule } from '@nestjs/mongoose';
import { EventModel, EventSchema } from './event.schema';

@Module({
  imports: [
    RoleModule,
    MongooseModule.forFeature([{ name: EventModel.name, schema: EventSchema }])
  ],
  controllers: [EventController],
  providers: [EventService]
})
export class EventModule { }
