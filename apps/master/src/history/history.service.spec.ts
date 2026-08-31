import { NotFoundException } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { History } from './history.entity';
import { HistoryService } from './history.service';

const IDPK = '11111111-2222-4333-8444-555555555555';

interface FakeQueryBuilder {
  andWhere: jest.Mock;
  orderBy: jest.Mock;
  skip: jest.Mock;
  take: jest.Mock;
  getManyAndCount: jest.Mock;
}

function makeRepo() {
  const qb: FakeQueryBuilder = {
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn(),
  };
  const repo = {
    create: jest.fn((v: unknown) => v),
    save: jest.fn(),
    findOneBy: jest.fn(),
    findOneByOrFail: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue(qb),
  };
  return { repo, qb };
}

function conditionsOf(qb: FakeQueryBuilder): string[] {
  return qb.andWhere.mock.calls.map((c: unknown[]) => c[0] as string);
}

describe('HistoryService', () => {
  describe('findAll', () => {
    it('aplica paginación por defecto (page 1, limit 25)', async () => {
      const { repo, qb } = makeRepo();
      qb.getManyAndCount.mockResolvedValue([[], 0]);
      const service = new HistoryService(repo as never);

      const result = await service.findAll({});

      expect(repo.createQueryBuilder).toHaveBeenCalledWith('h');
      expect(qb.skip).toHaveBeenCalledWith(0);
      expect(qb.take).toHaveBeenCalledWith(25);
      expect(result.meta).toEqual({ page: 1, limit: 25, total: 0, totalPages: 0 });
      expect(result.items).toEqual([]);
    });

    it('respeta page/limit personalizados', async () => {
      const { repo, qb } = makeRepo();
      qb.getManyAndCount.mockResolvedValue([[], 100]);
      const service = new HistoryService(repo as never);

      const result = await service.findAll({ page: 2, limit: 10 });

      expect(qb.skip).toHaveBeenCalledWith(10);
      expect(qb.take).toHaveBeenCalledWith(10);
      expect(result.meta).toEqual({ page: 2, limit: 10, total: 100, totalPages: 10 });
    });

    it('aplica filtros de type, idpk y rango de día UTC', async () => {
      const { repo, qb } = makeRepo();
      qb.getManyAndCount.mockResolvedValue([[], 0]);
      const service = new HistoryService(repo as never);

      await service.findAll({ type: 'demand-set', idpk: IDPK, receivedAt: '2026-08-31' });

      const conditions = conditionsOf(qb);
      expect(conditions).toContain('"h"."type" = :type');
      expect(conditions).toContain('"h"."idpk" = :idpk');
      expect(conditions).toContain(
        '"h"."receivedAt" >= :receivedAtStart AND "h"."receivedAt" < :receivedAtEnd',
      );
    });

    it('filtra por demand y unit dentro de packageBody.demands[]', async () => {
      const { repo, qb } = makeRepo();
      qb.getManyAndCount.mockResolvedValue([[], 0]);
      const service = new HistoryService(repo as never);

      await service.findAll({ demand: 1013.123, unit: 'GW' });

      const conditions = conditionsOf(qb);
      expect(conditions.some((s) => s.includes("(demand ->> 'demand')::numeric"))).toBe(true);
      expect(conditions.some((s) => s.includes("demand ->> 'unit' = :unit"))).toBe(true);
    });

    it('no agrega condiciones de demanda cuando demand es 0-undefined', async () => {
      const { repo, qb } = makeRepo();
      qb.getManyAndCount.mockResolvedValue([[], 0]);
      const service = new HistoryService(repo as never);

      await service.findAll({});

      expect(conditionsOf(qb).some((s) => s.includes('demand'))).toBe(false);
    });
  });

  describe('findOne', () => {
    it('devuelve el registro existente', async () => {
      const { repo } = makeRepo();
      const entity = { id: 'x' } as History;
      repo.findOneBy.mockResolvedValue(entity);
      const service = new HistoryService(repo as never);

      await expect(service.findOne('x')).resolves.toBe(entity);
      expect(repo.findOneBy).toHaveBeenCalledWith({ id: 'x' });
    });

    it('lanza NotFoundException si no existe', async () => {
      const { repo } = makeRepo();
      repo.findOneBy.mockResolvedValue(null);
      const service = new HistoryService(repo as never);

      await expect(service.findOne('missing')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    const dto = {
      idpk: IDPK,
      type: 'demand-set',
      packageBody: { demands: [] },
    };

    it('persiste y devuelve el evento', async () => {
      const { repo } = makeRepo();
      const saved = { id: 'new', idpk: IDPK } as History;
      repo.save.mockResolvedValue(saved);
      const service = new HistoryService(repo as never);

      const result = await service.create(dto);

      expect(result).toBe(saved);
      expect(repo.save).toHaveBeenCalled();
    });

    it('es idempotente ante violación de unicidad de idpk', async () => {
      const { repo } = makeRepo();
      const existing = { id: 'existing', idpk: IDPK } as History;
      const violation = new QueryFailedError('INSERT', [], { code: '23505' } as unknown as Error);
      repo.save.mockRejectedValue(violation);
      repo.findOneByOrFail.mockResolvedValue(existing);
      const service = new HistoryService(repo as never);

      const result = await service.create(dto);

      expect(result).toBe(existing);
      expect(repo.findOneByOrFail).toHaveBeenCalledWith({ idpk: IDPK });
    });
  });
});
