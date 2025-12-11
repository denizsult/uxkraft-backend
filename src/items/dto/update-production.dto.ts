import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsDateString, IsDate } from 'class-validator';

export class UpdateProductionDto {
  @ApiPropertyOptional({ description: 'CFA shops send date', example: '2024-01-20' })
  @IsDateString()
  @IsOptional()
  cfa_shops_send?: string;

  @ApiPropertyOptional({ description: 'CFA shops approved date', example: '2024-01-25' })
  @IsDateString()
  @IsOptional()
  cfa_shops_approved?: string;

  @ApiPropertyOptional({ description: 'CFA shops delivered date', example: '2024-02-01' })
  @IsDateString()
  @IsOptional()
  cfa_shops_delivered?: string;
}

