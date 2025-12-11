import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsDateString, IsString } from 'class-validator';

export class UpdateShippingDto {
  @ApiPropertyOptional({ description: 'Ordered date', example: '2024-02-05' })
  @IsDateString()
  @IsOptional()
  ordered_date?: string;

  @ApiPropertyOptional({ description: 'Shipped date', example: '2024-02-10' })
  @IsDateString()
  @IsOptional()
  shipped_date?: string;

  @ApiPropertyOptional({ description: 'Delivered date', example: '2024-02-15' })
  @IsDateString()
  @IsOptional()
  delivered_date?: string;

  @ApiPropertyOptional({ description: 'Shipping notes', example: 'Delivered to front desk' })
  @IsString()
  @IsOptional()
  shipping_notes?: string;
}

