import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsInt,
  ArrayMinSize,
  ValidateNested,
  IsOptional,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UpdatePlanningDto } from './update-planning.dto';
import { UpdateProductionDto } from './update-production.dto';
import { UpdateShippingDto } from './update-shipping.dto';

export class BulkUpdateTrackingDto {
  @ApiProperty({ description: 'Array of item IDs', example: [1, 2, 3] })
  @IsArray()
  @ArrayMinSize(1, { message: 'At least one item ID must be provided' })
  @IsInt({ each: true })
  @Type(() => Number)
  item_ids: number[];

  @ApiPropertyOptional({
    description: 'Planning data',
    type: UpdatePlanningDto,
  })
  @IsOptional()
  @ValidateIf((o) => o.planning && Object.keys(o.planning).length > 0)
  @ValidateNested()
  @Type(() => UpdatePlanningDto)
  planning?: UpdatePlanningDto;

  @ApiPropertyOptional({
    description: 'Production data',
    type: UpdateProductionDto,
  })
  @IsOptional()
  @ValidateIf((o) => o.production && Object.keys(o.production).length > 0)
  @ValidateNested()
  @Type(() => UpdateProductionDto)
  production?: UpdateProductionDto;

  @ApiPropertyOptional({
    description: 'Shipping data',
    type: UpdateShippingDto,
  })
  @IsOptional()
  @ValidateIf((o) => o.shipping && Object.keys(o.shipping).length > 0)
  @ValidateNested()
  @Type(() => UpdateShippingDto)
  shipping?: UpdateShippingDto;
}
