import { parseEnergyEvent } from './energy-event';

const valid = { idpk: 'x', type: 'demand-set', packageBody: { demands: [] } };

describe('parseEnergyEvent', () => {
  it('parsea un evento válido', () => {
    const event = parseEnergyEvent(Buffer.from(JSON.stringify(valid)));

    expect(event.idpk).toBe('x');
    expect(event.type).toBe('demand-set');
    expect(event.packageBody).toEqual({ demands: [] });
  });

  it('rechaza JSON inválido', () => {
    expect(() => parseEnergyEvent(Buffer.from('{invalid'))).toThrow();
  });

  it('rechaza un no-objeto', () => {
    expect(() => parseEnergyEvent(Buffer.from('"hello"'))).toThrow();
    expect(() => parseEnergyEvent(Buffer.from('[1,2,3]'))).toThrow();
    expect(() => parseEnergyEvent(Buffer.from('null'))).toThrow();
  });

  it('rechaza falta de idpk', () => {
    expect(() =>
      parseEnergyEvent(Buffer.from(JSON.stringify({ type: 'x', packageBody: {} }))),
    ).toThrow(/idpk/);
  });

  it('rechaza falta de type', () => {
    expect(() =>
      parseEnergyEvent(Buffer.from(JSON.stringify({ idpk: 'x', packageBody: {} }))),
    ).toThrow(/type/);
  });

  it('rechaza packageBody que no es objeto', () => {
    expect(() =>
      parseEnergyEvent(Buffer.from(JSON.stringify({ idpk: 'x', type: 'y', packageBody: 'nope' }))),
    ).toThrow(/packageBody/);
  });
});
