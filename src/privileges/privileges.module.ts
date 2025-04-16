import { Module } from '@nestjs/common';
import { PrivilegesService } from './privileges.service';
import { PrivilegesController } from './privileges.controller';
import { PrivilegeModel, PrivilegeSchema } from './privilege.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleModule } from 'src/role/role.module';

@Module({
  imports: [
    RoleModule,
    MongooseModule.forFeature([{ name: PrivilegeModel.name, schema: PrivilegeSchema }])
  ],
  providers: [PrivilegesService],
  controllers: [PrivilegesController],
  exports: [PrivilegesService]
})
export class PrivilegesModule { }
