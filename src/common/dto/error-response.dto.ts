export class ErrorResponseDto {
    success: boolean;
    error: string;
    errorCode: number; 

    constructor(error: string, errorCode: number) {
        this.success = false;
        this.error = error;
        this.errorCode = errorCode;
    }
}