import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import configYAML from 'config/config';
import { AppConfig } from 'config/config.module';
import { ProductsModule } from './products/products.module';
import { UserModule } from './users/user.module';

@Module({
    imports: [
        AppConfig,
        ProductsModule,
        MongooseModule.forRoot(configYAML().db.mongodb.host),
        UserModule,
    ],
    // middleware or api here controller
    controllers: [],
    providers: [],
})
export class AppModule {}
