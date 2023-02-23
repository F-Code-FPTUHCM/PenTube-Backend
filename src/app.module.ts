import { AppConfig } from './../config/config.module';
import { geoIPConfig } from '../config/geoIP/config';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import configYAML from './../config/config';
import { UserModule } from './Users/user.module';
import { ApiModule } from './api.module';
import { GeoIP2Module } from 'nestjs-geoip2';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { SearchModule } from './search/search.module';
import { SearchController } from './search/search.controller';
import { AuthModule } from './login/auth.module';

@Module({
    imports: [
        AppConfig,
        UserModule,
        ApiModule,
        GeoIP2Module.forRoot(geoIPConfig),
        ConfigModule.forRoot(),
        MongooseModule.forRoot(configYAML().db.mongodb.host),
        AuthModule,
        PassportModule.register({ session: true }),
        SearchModule,
    ],
    // middleware or api here controller
    controllers: [SearchController],
    providers: [],
})
export class AppModule {}
