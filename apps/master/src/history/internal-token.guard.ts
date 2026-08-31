import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { timingSafeEqual } from 'crypto';
import type { Request } from 'express';

export const INTERNAL_TOKEN_HEADER = 'x-internal-token';

/** Comparación en tiempo constante para evitar timing attacks. */
function safeEqual(a: string, b: string): boolean {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) {
    return false;
  }
  return timingSafeEqual(aBuf, bBuf);
}

/**
 * Protege los endpoints de escritura internos (POST /events) con un secreto
 * compartido entre `connector` y `master`. El secreto se lee de la variable de
 * entorno INTERNAL_TOKEN y se compara contra el header `x-internal-token`.
 */
@Injectable()
export class InternalTokenGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const expected = this.config.get<string>('INTERNAL_TOKEN');
    if (!expected) {
      throw new UnauthorizedException('Internal token is not configured');
    }

    const request = context.switchToHttp().getRequest<Request>();
    const provided = request.headers[INTERNAL_TOKEN_HEADER];
    const value = Array.isArray(provided) ? provided[0] : provided;

    if (typeof value !== 'string' || !safeEqual(expected, value)) {
      throw new UnauthorizedException('Unauthorized');
    }

    return true;
  }
}
