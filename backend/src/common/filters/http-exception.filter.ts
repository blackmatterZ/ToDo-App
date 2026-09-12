import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const isHttpException = exception instanceof HttpException;
    const status = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const isProduction = process.env.NODE_ENV === 'production';

    let errorResponse: any;

    if (isHttpException) {
      const res = exception.getResponse();
      errorResponse = typeof res === 'object' ? res : { message: res };
    } else {
      // Log unexpected error details internally
      this.logger.error(
        `Unexpected error occurred: ${exception instanceof Error ? exception.message : 'Unknown error'}`,
        exception instanceof Error ? exception.stack : undefined,
      );

      // Security: OWASP A05 - Hide sensitive database/internal exception details in production
      errorResponse = {
        message: isProduction
          ? 'Internal server error'
          : exception instanceof Error
            ? exception.message
            : 'Internal server error',
      };
    }

    response.status(status).json({
      statusCode: status,
      ...errorResponse,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
