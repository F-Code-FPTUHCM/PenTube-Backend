import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import configYAML from 'config/config';
import { AppConfig } from 'config/config.module';
import { ProductsModule } from './products/products.module';
import { UserModule } from './users/user.module';
import { AuthModule } from './login/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

@Module({
    imports: [
        AppConfig,
        ProductsModule,
        UserModule,
        ConfigModule.forRoot(),
        MongooseModule.forRoot(configYAML().db.mongodb.host),
        AuthModule,
        PassportModule.register({ session: true }),
    ],
    // middleware or api here controller
    controllers: [],
    providers: [],
})
export class AppModule {}
