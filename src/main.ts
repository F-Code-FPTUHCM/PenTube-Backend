import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configYAML } from 'config/config';
import { HttpExceptionFilter } from './Exception/exception.filter';
import { Logger, ValidationPipe } from '@nestjs/common';
import validationPipeConfig from 'config/validationPipes/config';
import { ConfigLogger } from './../config/logger/config';
import * as session from 'express-session';
import * as passport from 'passport';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: ['debug', 'error', 'log', 'verbose', 'warn'],
    });
    app.useGlobalFilters(new HttpExceptionFilter(new Logger()));
    app.useGlobalPipes(new ValidationPipe(validationPipeConfig));
    // TODO: uncomment this when changing to production
    // app.setGlobalPrefix(`/api/${configYAML().api.version}`);
    app.use(
        session({
            secret: configYAML().google.session_secret,
            resave: false,
            saveUninitialized: false,
        }),
    );
    app.use(passport.initialize());
    app.use(passport.session());
    await app
        .listen(configYAML().http.port)
        .then(() => console.log('Listening on port ' + configYAML().http.port));
}
bootstrap();
