import { ExceptionFilter, ArgumentsHost } from '@nestjs/common';
export declare const getStatusCode: (exception: unknown) => number;
export declare class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost): void;
}
export declare class BadRequestExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost): void;
}
