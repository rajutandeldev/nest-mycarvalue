import { HttpException, HttpStatus } from "@nestjs/common";

export class CustomExceptions extends HttpException {
  constructor(exceptions: { status: number; message: string }) {
    super(
      {
        statusCode: exceptions.status || HttpStatus.INTERNAL_SERVER_ERROR,
        message: exceptions.message || 'Something went wrong',
        error: 'CustomException',
      },
      exceptions.status || HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}