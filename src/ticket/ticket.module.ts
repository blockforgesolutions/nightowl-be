import { Module } from '@nestjs/common';
import { TicketController } from './ticket.controller';
import { TicketService } from './ticket.service';
import { RoleModule } from 'src/role/role.module';
import { MongooseModule } from '@nestjs/mongoose';
import { TicketModel, TicketSchema } from './ticket.schema';
import { QrCodeModule } from 'src/qr-code/qr-code.module';

@Module({
  imports: [
    RoleModule,
    QrCodeModule,
    MongooseModule.forFeature([{ name: TicketModel.name, schema: TicketSchema }])
  ],
  controllers: [TicketController],
  providers: [TicketService],
  exports: [TicketService]
})
export class TicketModule { }
