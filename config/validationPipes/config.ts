import { ResponseException } from './../../src/Exception/ResponseException';
import { ValidationError } from '@nestjs/class-validator';
import { configYAML } from 'config/config';

const exceptionFactory = (validationErrors: ValidationError[] = []) => {
    // use this for return multiple errors
    // return new ResponseException(
    //     400,
    //     validationErrors.map(item => {
    //         const result: string[] = [];
    //         for (const key in item.constraints) {
    //             result.push(item.constraints[key]);
    //         }
    //         return result.toString();
    //     }),
    // );
    for (const key of Object.keys(validationErrors[0].constraints)) {
        return new ResponseException(400, validationErrors[0].constraints[key]);
    }
};
// config for validation pipes
export const validationPipeConfig = {
    transform: true,
    disableErrorMessages: configYAML().env !== 'development',
    exceptionFactory,
    stopAtFirstError: true,
};

export const invalidateMessage = {
    invalid: 'Invalid $property',
    required: '$property is required',
};
export default validationPipeConfig;
