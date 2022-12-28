import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import configYAML from 'config/config';
import { AppConfig } from 'config/config.module';
import { ApiModule } from './api.module';
import { ConfigLogger } from './../config/logger/config';

@Module({
    imports: [AppConfig, ApiModule, MongooseModule.forRoot(configYAML().db.mongodb.host)],
    // middleware or api here controller
    controllers: [],
    providers: [],
})
export class AppModule {}
