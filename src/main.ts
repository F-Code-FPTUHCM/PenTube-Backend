import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configYAML } from 'config/config';
import { ConfigLogger } from './../config/logger/config';
import * as session from 'express-session';
import * as passport from 'passport';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: new ConfigLogger(),
    });
    app.use(
        session({
            secret: process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: false,
        }),
    );
    app.use(passport.initialize());
    app.use(passport.session());
    await app.listen(configYAML().http.port).then(() => console.log('Listening on port 4000'));
}
bootstrap();
