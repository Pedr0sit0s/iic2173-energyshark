import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { QueryHistoryDto } from './dto/query-history.dto';
import { History } from './history.entity';

export interface HistoryPageMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface HistoryPage {
  items: History[];
  meta: HistoryPageMeta;
}

const PG_UNIQUE_VIOLATION = '23505';

function isUniqueViolation(error: unknown): boolean {
  return (
    error instanceof QueryFailedError &&
    (error.driverError as { code?: string } | undefined)?.code === PG_UNIQUE_VIOLATION
  );
}

/**
 * Convierte un string de fecha (ISO8601, p. ej. "2025-08-08" o "2025-08-08T10:00:00Z")
 * en el rango [00:00:00.000Z, 00:00:00.000Z + 1 día). Al usar un rango (en lugar de
 * `::date`) la consulta puede aprovechar el índice de `receivedAt`.
 */
function dayRangeUtc(value: string): { start: Date; end: Date } {
  const start = new Date(`${value.slice(0, 10)}T00:00:00.000Z`);
  return { start, end: new Date(start.getTime() + 86_400_000) };
}

@Injectable()
export class HistoryService {
  constructor(
    @InjectRepository(History)
    private readonly historyRepository: Repository<History>,
  ) {}

  /**
   * Persiste un evento. Es idempotente por `idpk` (el enunciado lo define como
   * "no repetible"): si ya existe, devuelve el registro existente.
   */
  async create(dto: CreateEventDto): Promise<History> {
    const event = this.historyRepository.create({
      idpk: dto.idpk,
      type: dto.type,
      packageBody: dto.packageBody,
      validUntil: this.extractValidUntil(dto),
      receivedAt: new Date(),
    });

    try {
      return await this.historyRepository.save(event);
    } catch (error) {
      if (!isUniqueViolation(error)) {
        throw error;
      }
      // Carrera: otro request insertó el mismo idpk; devolvemos el existente.
      return this.historyRepository.findOneByOrFail({ idpk: dto.idpk });
    }
  }

  async findAll(query: QueryHistoryDto): Promise<HistoryPage> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 25;

    const qb = this.historyRepository.createQueryBuilder('h');

    if (query.type) {
      qb.andWhere('"h"."type" = :type', { type: query.type });
    }
    if (query.idpk) {
      qb.andWhere('"h"."idpk" = :idpk', { idpk: query.idpk });
    }
    if (query.receivedAt) {
      // Filtro por día (UTC) con rango: ?receivedAt=2025-08-08 → ese día calendario.
      const { start, end } = dayRangeUtc(query.receivedAt);
      qb.andWhere('"h"."receivedAt" >= :receivedAtStart AND "h"."receivedAt" < :receivedAtEnd', {
        receivedAtStart: start,
        receivedAtEnd: end,
      });
    }
    if (query.receivedAtFrom) {
      qb.andWhere('"h"."receivedAt" >= :receivedAtFrom', {
        receivedAtFrom: new Date(query.receivedAtFrom),
      });
    }
    if (query.receivedAtTo) {
      qb.andWhere('"h"."receivedAt" <= :receivedAtTo', {
        receivedAtTo: new Date(query.receivedAtTo),
      });
    }
    if (query.validUntilFrom) {
      qb.andWhere('"h"."validUntil" >= :validUntilFrom', {
        validUntilFrom: new Date(query.validUntilFrom),
      });
    }
    if (query.validUntilTo) {
      qb.andWhere('"h"."validUntil" <= :validUntilTo', {
        validUntilTo: new Date(query.validUntilTo),
      });
    }
    if (query.city) {
      // La ciudad vive dentro del array `packageBody.demands[].city`.
      qb.andWhere(
        `EXISTS (
          SELECT 1 FROM jsonb_array_elements("h"."packageBody" -> 'demands') AS demand
          WHERE demand ->> 'city' = :city
        )`,
        { city: query.city },
      );
    }
    if (query.unit) {
      // La unidad vive dentro de `packageBody.demands[].unit` (p. ej. "GW").
      qb.andWhere(
        `EXISTS (
          SELECT 1 FROM jsonb_array_elements("h"."packageBody" -> 'demands') AS demand
          WHERE demand ->> 'unit' = :unit
        )`,
        { unit: query.unit },
      );
    }
    if (query.demand !== undefined) {
      // El valor de demanda vive dentro de `packageBody.demands[].demand` (número).
      qb.andWhere(
        `EXISTS (
          SELECT 1 FROM jsonb_array_elements("h"."packageBody" -> 'demands') AS demand
          WHERE (demand ->> 'demand')::numeric = :demand
        )`,
        { demand: query.demand },
      );
    }

    qb.orderBy('h.receivedAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [items, total] = await qb.getManyAndCount();

    return {
      items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<History> {
    const event = await this.historyRepository.findOneBy({ id });

    if (!event) {
      throw new NotFoundException(`History event with id "${id}" not found`);
    }

    return event;
  }

  /**
   * El evento real trae `validUntil` dentro de `packageBody` (schema del
   * enunciado); se usa también el campo de nivel superior como respaldo.
   */
  private extractValidUntil(dto: CreateEventDto): Date | null {
    const raw =
      (dto.packageBody as { validUntil?: unknown }).validUntil ?? dto.validUntil;

    if (typeof raw !== 'string' || raw === '') {
      return null;
    }

    const date = new Date(raw);
    return Number.isNaN(date.getTime()) ? null : date;
  }
}
