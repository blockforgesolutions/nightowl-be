export class ApiResponseDto<T> {
    success: boolean;
    data: T | null;
    error?: T;
  
    constructor(success: boolean, data: T | null, error?: T) {
      this.success = success;
      this.data = data;
      if (error) this.error = error;
    }
  }
  