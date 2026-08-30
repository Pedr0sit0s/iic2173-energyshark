function timestamp(): string {
  return new Date().toISOString();
}

export const logger = {
  info: (message: string): void => console.log(`[${timestamp()}] INFO  ${message}`),
  warn: (message: string): void => console.warn(`[${timestamp()}] WARN  ${message}`),
  error: (message: string): void => console.error(`[${timestamp()}] ERROR ${message}`),
};

/** Convierte cualquier error en un mensaje corto y legible. */
export function reasonOf(error: unknown): string {
  if (error instanceof Error) {
    return error.name === 'AbortError' ? 'timeout' : error.message;
  }
  return String(error);
}
