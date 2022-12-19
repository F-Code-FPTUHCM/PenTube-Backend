import { Controller, Get } from '@nestjs/common';

@Controller('api')
export class ApiController {
    @Get()
    default(): string {
        return 'Hello World';
    }
}
