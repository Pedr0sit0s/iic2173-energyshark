import { Type } from 'class-transformer';
import { IsISO8601, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 25;
export const MAX_LIMIT = 100;

export class QueryHistoryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = DEFAULT_PAGE;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(MAX_LIMIT)
  limit?: number = DEFAULT_LIMIT;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsISO8601()
  receivedAtFrom?: string;

  @IsOptional()
  @IsISO8601()
  receivedAtTo?: string;

  @IsOptional()
  @IsISO8601()
  validUntilFrom?: string;

  @IsOptional()
  @IsISO8601()
  validUntilTo?: string;

  @IsOptional()
  @IsString()
  city?: string;
}
