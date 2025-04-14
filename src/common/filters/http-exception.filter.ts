import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiResponseDto } from '../dto/response.dto';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let errorResponseObj = exception instanceof HttpException
      ? exception.getResponse()
      : { message: 'Internal server error' };

    if (exception instanceof Error && exception.name === 'ValidationError') {
      errorResponseObj = {
        message: 'Validation error',
        details: exception.message, 
      };
    }

    console.log(exception);

    const errorResponse = new ApiResponseDto(
      false,
      null,
      errorResponseObj,
    );

    response.status(status).json(errorResponse);
  }
}
