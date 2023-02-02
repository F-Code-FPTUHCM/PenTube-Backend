import { AppConfig } from './../config/config.module';
import { geoIPConfig } from '../config/geoIP/config';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import configYAML from 'config/config';
import { UserModule } from './users/user.module';
import { ApiModule } from './api.module';
import { GeoIP2Module } from 'nestjs-geoip2';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        AppConfig,
        UserModule,
        ApiModule,
        GeoIP2Module.forRoot(geoIPConfig),
        ConfigModule.forRoot(),
        MongooseModule.forRoot(configYAML().db.mongodb.host),
    ],
    // middleware or api here controller
    controllers: [],
    providers: [],
})
export class AppModule {}
