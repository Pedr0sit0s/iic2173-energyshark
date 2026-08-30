import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

export type PackageBody = Record<string, unknown>;

@Entity('history')
export class History {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index('IDX_history_idpk', { unique: true })
  @Column({ type: 'uuid', comment: 'UUID del evento asignado por el curso (idpk, no repetible)' })
  idpk: string;

  @Index('IDX_history_type')
  @Column({ type: 'text', comment: 'Tipo del evento, p. ej. demand-set' })
  type: string;

  @Index('IDX_history_received_at')
  @Column({ type: 'timestamptz', comment: 'Instante en que master recibió el evento (UTC)' })
  receivedAt: Date;

  @Index('IDX_history_valid_until')
  @Column({ type: 'timestamptz', nullable: true, comment: 'Vigencia del dato, si aplica' })
  validUntil: Date | null;

  @Column({ type: 'jsonb', comment: 'Payload original del evento' })
  packageBody: PackageBody;

  @CreateDateColumn({ type: 'timestamptz', comment: 'Fecha de creación del registro' })
  createdAt: Date;
}
