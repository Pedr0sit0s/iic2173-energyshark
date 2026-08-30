import { computeBackoffDelay, type BackoffOptions } from './backoff';

describe('computeBackoffDelay', () => {
  const noJitter: BackoffOptions = { baseMs: 1_000, capMs: 8_000, jitterMs: 0 };

  it('crece exponencialmente desde baseMs', () => {
    expect(computeBackoffDelay(0, noJitter)).toBe(1_000);
    expect(computeBackoffDelay(1, noJitter)).toBe(2_000);
    expect(computeBackoffDelay(2, noJitter)).toBe(4_000);
  });

  it('se acota a capMs', () => {
    expect(computeBackoffDelay(3, noJitter)).toBe(8_000);
    expect(computeBackoffDelay(4, noJitter)).toBe(8_000);
    expect(computeBackoffDelay(20, noJitter)).toBe(8_000);
  });

  it('añade jitter en el rango [0, jitterMs)', () => {
    const withJitter: BackoffOptions = { baseMs: 1_000, capMs: 8_000, jitterMs: 500 };
    const value = computeBackoffDelay(0, withJitter);
    expect(value).toBeGreaterThanOrEqual(1_000);
    expect(value).toBeLessThan(1_500);
  });

  it('no muta los valores pasados', () => {
    const options: BackoffOptions = { baseMs: 1_000, capMs: 8_000, jitterMs: 0 };
    computeBackoffDelay(3, options);
    expect(options).toEqual({ baseMs: 1_000, capMs: 8_000, jitterMs: 0 });
  });
});
