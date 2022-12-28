import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    LoggerService,
} from '@nestjs/common';
import { ResponseModal } from './../Response/response.modal';
import { Response } from 'express';
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    constructor(private logger: LoggerService) {}

    catch(exception: HttpException, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        this.handleMessage(exception);

        HttpExceptionFilter.handleResponse(response, exception);
    }

    private handleMessage(exception: HttpException | Error): void {
        let message: string | object = 'Internal Server Error';
        if (exception instanceof HttpException) {
            message = exception.message;
        } else if (exception instanceof Error) {
            message = exception.stack.toString();
        }

        this.logger.error(message);
    }

    private static handleResponse(response: Response, exception: HttpException | Error): void {
        let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        let responseBody: ResponseModal | string | object = new ResponseModal(
            statusCode,
            'Internal server Error',
        );

        if (exception instanceof HttpException) {
            responseBody = exception.getResponse();
            statusCode = exception.getStatus();
        } else if (exception instanceof Error) {
            responseBody = new ResponseModal(statusCode, 'Internal Server Error');
        }

        response.status(statusCode).json(responseBody);
    }
}
