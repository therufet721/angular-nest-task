import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min, Max } from 'class-validator';

/**
 * Pagination DTO with validation
 * Prevents abuse by limiting max page size to 100 items
 */
export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1, { message: 'Page must be at least 1' })
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1, { message: 'Limit must be at least 1' })
  @Max(100, { message: 'Limit cannot exceed 100 items per page' })
  limit: number = 10;
}
