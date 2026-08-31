import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { QueryHistoryDto } from './query-history.dto';

function validate(payload: Record<string, unknown>) {
  const dto = plainToInstance(QueryHistoryDto, payload, {
    enableImplicitConversion: true,
  });
  return validateSync(dto);
}

describe('QueryHistoryDto', () => {
  it('acepta valores válidos', () => {
    expect(validate({ page: '2', limit: '25' })).toHaveLength(0);
  });

  it('rechaza page < 1', () => {
    expect(validate({ page: 0 }).length).toBeGreaterThan(0);
  });

  it('rechaza limit mayor al máximo (100)', () => {
    expect(validate({ limit: 101 }).length).toBeGreaterThan(0);
  });

  it('rechaza limit 0', () => {
    expect(validate({ limit: 0 }).length).toBeGreaterThan(0);
  });

  it('rechaza fecha inválida', () => {
    expect(validate({ receivedAt: 'not-a-date' }).length).toBeGreaterThan(0);
  });

  it('rechaza idpk que no es UUID', () => {
    expect(validate({ idpk: 'nope' }).length).toBeGreaterThan(0);
  });

  it('acepta idpk UUID', () => {
    expect(
      validate({ idpk: '11111111-2222-4333-8444-555555555555' }),
    ).toHaveLength(0);
  });

  it('rechaza demand no numérico', () => {
    expect(validate({ demand: 'abc' }).length).toBeGreaterThan(0);
  });

  it('acepta demand numérico', () => {
    expect(validate({ demand: '1013.5' })).toHaveLength(0);
  });
});
