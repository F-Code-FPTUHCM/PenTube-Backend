import { HttpException } from '@nestjs/common';

export class ResponseException extends HttpException {
    constructor(status: number, message: string | object) {
        super(
            {
                status: status,
                message,
                statusMessage: message,
            },
            status,
        );
    }
}
