import { Module } from '@nestjs/common';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';
import { RoleModule } from 'src/role/role.module';
import { MongooseModule } from '@nestjs/mongoose';
import { EmployeeModel, EmployeeSchema } from './employee.schema';

@Module({
  imports: [
    RoleModule,
    MongooseModule.forFeature([{ name: EmployeeModel.name, schema: EmployeeSchema }])
  ],
  controllers: [EmployeeController],
  providers: [EmployeeService],
  exports: [EmployeeService]
})
export class EmployeeModule { }
