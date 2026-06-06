import { IsEnum, IsIn, IsInt, IsOptional, Max, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export type AnalyticsPeriod = '7d' | '30d' | '90d' | '1y';

export class AnalyticsPeriodQueryDto {
  @ApiPropertyOptional({ enum: ['7d', '30d', '90d', '1y'], default: '30d' })
  @IsOptional()
  @IsIn(['7d', '30d', '90d', '1y'])
  period?: AnalyticsPeriod = '30d';
}

export class TimeseriesQueryDto extends AnalyticsPeriodQueryDto {
  @ApiPropertyOptional({ enum: ['revenue', 'escrow', 'users', 'listings'], default: 'revenue' })
  @IsOptional()
  @IsIn(['revenue', 'escrow', 'users', 'listings'])
  metric?: 'revenue' | 'escrow' | 'users' | 'listings' = 'revenue';

  @ApiPropertyOptional({ enum: ['day', 'week', 'month'], default: 'month' })
  @IsOptional()
  @IsIn(['day', 'week', 'month'])
  granularity?: 'day' | 'week' | 'month' = 'month';
}

export class BreakdownQueryDto extends AnalyticsPeriodQueryDto {
  @ApiPropertyOptional({ enum: ['type', 'city', 'status'], default: 'type' })
  @IsOptional()
  @IsIn(['type', 'city', 'status'])
  groupBy?: 'type' | 'city' | 'status' = 'type';
}

export class BrokersQueryDto extends AnalyticsPeriodQueryDto {
  @ApiPropertyOptional({ default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number = 10;

  @ApiPropertyOptional({ enum: ['listings', 'revenue', 'leads'], default: 'listings' })
  @IsOptional()
  @IsIn(['listings', 'revenue', 'leads'])
  sortBy?: 'listings' | 'revenue' | 'leads' = 'listings';
}
