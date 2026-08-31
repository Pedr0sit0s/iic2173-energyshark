import { UnauthorizedException } from '@nestjs/common';
import { InternalTokenGuard } from './internal-token.guard';

function ctxWithHeader(value: unknown): never {
  return {
    switchToHttp: () => ({
      getRequest: () => ({ headers: { 'x-internal-token': value } }),
    }),
  } as never;
}

describe('InternalTokenGuard', () => {
  const TOKEN = 'a-very-long-secret-token';

  it('permite cuando el token coincide', () => {
    const config = { get: jest.fn().mockReturnValue(TOKEN) };
    const guard = new InternalTokenGuard(config as never);

    expect(guard.canActivate(ctxWithHeader(TOKEN))).toBe(true);
  });

  it('rechaza token incorrecto', () => {
    const config = { get: jest.fn().mockReturnValue(TOKEN) };
    const guard = new InternalTokenGuard(config as never);

    expect(() => guard.canActivate(ctxWithHeader('wrong'))).toThrow(UnauthorizedException);
  });

  it('rechaza header ausente', () => {
    const config = { get: jest.fn().mockReturnValue(TOKEN) };
    const guard = new InternalTokenGuard(config as never);

    expect(() => guard.canActivate(ctxWithHeader(undefined))).toThrow(UnauthorizedException);
  });

  it('rechaza cuando no hay token configurado', () => {
    const config = { get: jest.fn().mockReturnValue(undefined) };
    const guard = new InternalTokenGuard(config as never);

    expect(() => guard.canActivate(ctxWithHeader(TOKEN))).toThrow(UnauthorizedException);
  });
});
