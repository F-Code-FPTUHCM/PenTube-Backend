import { AppConfig } from './../config/config.module';
import { geoIPConfig } from '../config/geoIP/config';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import configYAML from 'config/config';
import { ApiModule } from './api.module';
import { ConfigLogger } from './../config/logger/config';
import { GeoIP2Module } from 'nestjs-geoip2';
import { AuthModule } from './login/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

@Module({
    imports: [
        AppConfig,
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
