import { NextResponse } from 'next/server';

const isDev = process.env.NODE_ENV === 'development';

export function dbError(error: unknown, context?: string): NextResponse {
  if (context) console.error(context, error);
  const detail = isDev && error instanceof Error ? { detail: error.message } : {};
  return NextResponse.json(
    { success: false, message: 'Interní chyba serveru', ...detail },
    { status: 500 }
  );
}

interface MongooseValidationError {
  name: 'ValidationError';
  errors: Record<string, { message: string }>;
}

/** Type guard pro Mongoose ValidationError */
export function isValidationError(error: unknown): error is MongooseValidationError {
  return (
    typeof error === 'object' &&
    error !== null &&
    (error as MongooseValidationError).name === 'ValidationError' &&
    typeof (error as MongooseValidationError).errors === 'object'
  );
}

/** Standardní response pro Mongoose validační chyby */
export function validationError(error: MongooseValidationError): NextResponse {
  const errors = Object.values(error.errors).map(e => e.message);
  return NextResponse.json(
    { success: false, message: 'Validace selhala', errors },
    { status: 400 }
  );
}

/** Type guard pro MongoDB duplicate key error (kód 11000) */
export function isDuplicateKeyError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code: unknown }).code === 11000
  );
}
