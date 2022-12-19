import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configYAML } from 'config/config';
import { ConfigLogger } from './../config/logger/config';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: ['debug', 'error', 'log', 'verbose', 'warn'],
    });
    await app
        .listen(configYAML().http.port)
        .then(() => console.log('Listening on port ' + configYAML().http.port));
}
bootstrap();
