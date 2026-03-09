export class HttpError extends Error {
  public readonly statusCode: number;

  public constructor(statusCode: number, message: string) {
    super(message);
    this.name = 'HttpError';
    this.statusCode = statusCode;
  }
}

export const createHttpError = (statusCode: number, message: string): HttpError => {
  return new HttpError(statusCode, message);
};

export const isHttpError = (error: unknown): error is HttpError => {
  return (
    error instanceof Error &&
    'statusCode' in error &&
    typeof (error as { statusCode?: unknown }).statusCode === 'number'
  );
};
