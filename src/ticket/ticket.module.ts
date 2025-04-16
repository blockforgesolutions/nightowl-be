import { Module } from '@nestjs/common';
import { TicketController } from './ticket.controller';
import { TicketService } from './ticket.service';
import { RoleModule } from 'src/role/role.module';
import { MongooseModule } from '@nestjs/mongoose';
import { TicketModel, TicketSchema } from './ticket.schema';
import { QrCodeModule } from 'src/qr-code/qr-code.module';
import { JwtModule } from '@nestjs/jwt';
import { EventModule } from 'src/event/event.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    RoleModule,
    QrCodeModule,
    EventModule,
    UserModule,
    MongooseModule.forFeature([{ name: TicketModel.name, schema: TicketSchema }]),
    JwtModule.register({
      secret: process.env.QR_SECRET || 'defaultSecretKey',
    }),
  ],
  controllers: [TicketController],
  providers: [TicketService],
  exports: [TicketService]
})
export class TicketModule { }
