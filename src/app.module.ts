import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import configYAML from 'config/config';
import { AppConfig } from 'config/config.module';
import { ProductsModule } from './products/products.module';

@Module({
    imports: [
        AppConfig,
        ProductsModule,
        MongooseModule.forRoot(configYAML().db.mongodb),
        ProductsModule,
    ],
    // middleware or api here controller
    controllers: [],
    providers: [],
})
export class AppModule {}
