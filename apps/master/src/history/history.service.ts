import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

@Injectable()
export class HistoryService {
  constructor(
    @InjectRepository(History)
    private readonly historyRepository: Repository<History>,
  ) {}

  async create(dto: CreateEventDto): Promise<History> {
    const event = this.historyRepository.create({
      idpk: dto.idpk,
      type: dto.type,
      packageBody: dto.packageBody,
      validUntil: dto.validUntil ? new Date(dto.validUntil) : null,
      receivedAt: new Date(),
    });

    return this.historyRepository.save(event);
  }

  async findAll(query: QueryHistoryDto): Promise<HistoryPage> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 25;

    const qb = this.historyRepository.createQueryBuilder('h');

    if (query.type) {
      qb.andWhere('h.type = :type', { type: query.type });
    }
    if (query.receivedAtFrom) {
      qb.andWhere('h.receivedAt >= :receivedAtFrom', {
        receivedAtFrom: new Date(query.receivedAtFrom),
      });
    }
    if (query.receivedAtTo) {
      qb.andWhere('h.receivedAt <= :receivedAtTo', {
        receivedAtTo: new Date(query.receivedAtTo),
      });
    }
    if (query.validUntilFrom) {
      qb.andWhere('h.validUntil >= :validUntilFrom', {
        validUntilFrom: new Date(query.validUntilFrom),
      });
    }
    if (query.validUntilTo) {
      qb.andWhere('h.validUntil <= :validUntilTo', {
        validUntilTo: new Date(query.validUntilTo),
      });
    }
    if (query.city) {
      qb.andWhere(`"${qb.alias}"."packageBody"->>'city' = :city`, {
        city: query.city,
      });
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
}
