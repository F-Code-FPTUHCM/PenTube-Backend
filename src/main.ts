import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configYAML } from 'config/config';
import { HttpExceptionFilter } from './Exception/exception.filter';
import { Logger, ValidationPipe } from '@nestjs/common';
import validationPipeConfig from 'config/validationPipes/config';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: ['debug', 'error', 'log', 'verbose', 'warn'],
    });
    app.useGlobalFilters(new HttpExceptionFilter(new Logger()));
    app.useGlobalPipes(new ValidationPipe(validationPipeConfig));
    app.setGlobalPrefix(`/api/${configYAML().api.version}`);
    await app
        .listen(configYAML().http.port)
        .then(() => console.log('Listening on port ' + configYAML().http.port));
}
bootstrap();
