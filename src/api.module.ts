import { RouterModule } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { VideoModule } from './videos/video.module';

// Add all api modules with a specific path
const routeModules = [{ path: 'video', module: VideoModule }];

@Module({
    // import both module
    imports: [VideoModule, RouterModule.register(routeModules)],
    controllers: [],
    providers: [],
})
export class ApiModule {}
