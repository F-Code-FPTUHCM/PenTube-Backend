import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configYAML } from 'config/config';
import { ConfigLogger } from './../config/logger/config';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: new ConfigLogger(),
    });
    await app.listen(configYAML().http.port).then(() => console.log('Listening on port 3000'));
}
bootstrap();
