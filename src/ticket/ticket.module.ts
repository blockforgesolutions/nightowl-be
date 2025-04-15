import { Module } from '@nestjs/common';
import { TicketController } from './ticket.controller';
import { TicketService } from './ticket.service';
import { RoleModule } from 'src/role/role.module';
import { MongooseModule } from '@nestjs/mongoose';
import { TicketModel, TicketSchema } from './ticket.schema';

@Module({
  imports: [
    RoleModule,
    MongooseModule.forFeature([{ name: TicketModel.name, schema: TicketSchema }])
  ],
  controllers: [TicketController],
  providers: [TicketService]
})
export class TicketModule { }
