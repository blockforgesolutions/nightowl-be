import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleModel, RoleSchema } from './role.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: RoleModel.name, schema: RoleSchema }])
    ],
    providers: [RoleService],
    controllers: [RoleController],
    exports:[RoleService, MongooseModule]
})
export class RoleModule { }
