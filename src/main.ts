import { configYAML } from './../config/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './Exception/exception.filter';
import { Logger, ValidationPipe } from '@nestjs/common';
import validationPipeConfig from 'config/validationPipes/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigLogger } from './../config/logger/config';

import * as session from 'express-session';
import * as passport from 'passport';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: ['debug', 'error', 'log', 'verbose', 'warn'],
    });
    // swagger config
    const config = new DocumentBuilder()
        .setTitle('Cats example')
        .setDescription('The cats API description')
        .setVersion('1.0')
        .addTag('cats')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

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
