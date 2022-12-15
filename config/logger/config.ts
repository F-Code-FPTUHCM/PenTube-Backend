import { LoggerService } from '@nestjs/common';

// To config message or logger file
export class ConfigLogger implements LoggerService {
    // Logging information
    log(message: any, context?: string) {
        console.log(message);
    }

    error(message: any, trace?: string, context?: string) {
        console.error(message);
    }

    warn(message: any, context?: string) {
        console.warn(message);
    }

    debug?(message: any, context?: string) {
        console.debug(message);
    }

    verbose?(message: any, context?: string) {
        console.log(message);
    }
}
