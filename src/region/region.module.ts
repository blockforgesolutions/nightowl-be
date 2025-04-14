import { Module } from '@nestjs/common';
import { RegionController } from './region.controller';
import { RegionService } from './region.service';
import { MongooseModule } from '@nestjs/mongoose';
import { RegionModel, RegionSchema } from './region.schema';
import { RoleModule } from 'src/role/role.module';

@Module({
  imports: [
    RoleModule,
    MongooseModule.forFeature([{ name: RegionModel.name, schema: RegionSchema }])
  ],
  controllers: [RegionController],
  providers: [RegionService]
})
export class RegionModule { }
