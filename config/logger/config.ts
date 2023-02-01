import { Logger } from '@nestjs/common';

// To config message or logger file
export class ConfigLogger extends Logger {
    // Logging information
    log(message: any, context?: string) {
        super.log(message, context);
    }

    error(message: any, trace?: string, context?: string) {
        super.error(message, trace, context);
    }

    warn(message: any, context?: string) {
        super.warn(message, context);
    }

    debug(message: any, context?: string) {
        super.debug(message, context);
    }

    verbose(message: any, context?: string) {
        super.verbose(message, context);
    }
}
