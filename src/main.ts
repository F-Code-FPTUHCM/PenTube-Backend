import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configYAML } from 'config/config';
import * as session from 'express-session';
import * as passport from 'passport';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: ['debug', 'error', 'log', 'warn', 'verbose'],
    });
    app.use(
        session({
            secret: configYAML().google.session_secret,
            resave: false,
            saveUninitialized: false,
        }),
    );
    app.use(passport.initialize());
    app.use(passport.session());
    await app.listen(configYAML().http.port).then(() => console.log('Listening on port 4000'));
}
bootstrap();
