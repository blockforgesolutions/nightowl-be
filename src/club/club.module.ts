import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClubModel, ClubSchema } from './club.schema';
import { ClubController } from './club.controller';
import { ClubService } from './club.service';
import { RoleModule } from 'src/role/role.module';

@Module({
  imports: [
    RoleModule,
    MongooseModule.forFeature([{ name: ClubModel.name, schema: ClubSchema }])
  ],
  controllers: [ClubController],
  providers: [ClubService]
})
export class ClubModule { }
