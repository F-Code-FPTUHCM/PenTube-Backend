import { ConfigLogger } from './config';
import { Module } from '@nestjs/common';

@Module({ providers: [ConfigLogger], exports: [ConfigLogger] })
export class LoggerModule {}
