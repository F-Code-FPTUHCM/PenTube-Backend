import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.services';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchema } from './products.modal';

@Module({
    controllers: [ProductsController],
    providers: [ProductsService],
    imports: [MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }])],
})
export class ProductsModule {}
