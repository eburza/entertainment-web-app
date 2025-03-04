// Define your API response types
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

// Define your error type
export interface ApiError {
  message: string;
  status: number;
}

// Implement error class
export class ApiErrorClass extends Error implements ApiError {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}
