import { IsISO8601, IsObject, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateEventDto {
  @IsUUID()
  idpk: string;

  @IsString()
  type: string;

  @IsObject()
  packageBody: Record<string, unknown>;

  @IsOptional()
  @IsISO8601()
  validUntil?: string;
}
