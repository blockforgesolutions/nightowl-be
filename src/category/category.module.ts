import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryModel, CategorySchema } from './category.model';
import { RoleModule } from 'src/role/role.module';

@Module({
  imports: [
    RoleModule,
    MongooseModule.forFeature([{ name: CategoryModel.name, schema: CategorySchema }])
  ],
  providers: [CategoryService],
  controllers: [CategoryController]
})
export class CategoryModule { }
