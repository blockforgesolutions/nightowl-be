import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { MailModule } from './mail/mail.module';
import { PaymentModule } from './payment/payment.module';
import { CategoryModule } from './category/category.module';
import { ClubModule } from './club/club.module';
import { OrderModule } from './order/order.module';
import { ProductModule } from './product/product.module';
import { RegionModule } from './region/region.module';
import { PrivilegesModule } from './privileges/privileges.module';
import { EventModule } from './event/event.module';
import { TicketModule } from './ticket/ticket.module';
import { QrCodeModule } from './qr-code/qr-code.module';
import { PrivilegeInitializer } from './scripts/privilege.script';
import { EmployeeModule } from './employee/employee.module';
// import { PrivilegeAssignerScript } from './scripts/assing-privileges.script';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env`,
      isGlobal: true
    }),
    MongooseModule.forRoot(process.env.MONGODB_URL!, {
      dbName: 'nightowl'
    }),
    AuthModule,
    UserModule,
    RoleModule,
    MailModule,
    PaymentModule,
    CategoryModule,
    ClubModule,
    OrderModule,
    ProductModule,
    RegionModule,
    PrivilegesModule,
    EventModule,
    TicketModule,
    QrCodeModule,
    EmployeeModule,

  ],
  controllers: [AppController],
  providers: [AppService, PrivilegeInitializer],
})
export class AppModule { }
