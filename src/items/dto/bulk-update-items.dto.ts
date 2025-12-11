import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsInt,
  IsString,
  IsOptional,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';

export class BulkUpdateItemsDto {
  @ApiProperty({ description: 'Array of item IDs', example: [1, 2, 3] })
  @IsArray()
  @ArrayMinSize(1, { message: 'At least one item ID must be provided' })
  @IsInt({ each: true })
  @Type(() => Number)
  item_ids: number[];

  @ApiPropertyOptional({ description: 'Location', example: 'Warehouse A' })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiPropertyOptional({ description: 'Category', example: 'Electronics' })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({ description: 'Ship From', example: 'Warehouse A' })
  @IsString()
  @IsOptional()
  ship_from?: string;

  @ApiPropertyOptional({ description: 'Notes', example: 'Notes' })
  @IsString()
  @IsOptional()
  ship_notes?: string;
}

