import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductModel, ProductSchema } from './product.schema';
import { RoleModule } from 'src/role/role.module';

@Module({
  imports: [
    RoleModule,
    MongooseModule.forFeature([{name:ProductModel.name, schema: ProductSchema}])
  ],
  providers: [ProductService],
  controllers: [ProductController]
})
export class ProductModule {}
