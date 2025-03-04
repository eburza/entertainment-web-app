// Define API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  status?: number;
}

// Define error type
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

export function createApiResponse<T>(
  success: boolean, 
  data?: T, 
  message?: string, 
  error?: string, 
  status?: number
): ApiResponse<T> {
  return {
    success,
    data,
    message,
    error,
    status
  };
}
