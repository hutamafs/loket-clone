export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  code: number;
}
export function createApiResponse<T>(params: {
  success: boolean;
  data?: T;
  error?: string;
  code: number;
}): ApiResponse<T> {
  return {
    success: params.success,
    data: params.data,
    error: params.error,
    code: params.code,
  };
}
