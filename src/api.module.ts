import { PassportModule } from '@nestjs/passport';
import { AuthModule } from './login/auth.module';
import { RouterModule } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { VideoModule } from './videos/video.module';

// Add all api modules with a specific path
const routeModules = [
    { path: 'video', module: VideoModule },
    {
        path: 'auth',
        module: AuthModule,
    },
];

@Module({
    // import both module
    imports: [
        VideoModule,
        AuthModule,
        PassportModule.register({ session: true }),
        RouterModule.register(routeModules),
    ],
    controllers: [],
    providers: [],
})
export class ApiModule {}
