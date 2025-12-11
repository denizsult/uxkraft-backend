import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsDateString, IsDate } from 'class-validator';

export class UpdatePlanningDto {
  @ApiPropertyOptional({ description: 'PO approval date', example: '2024-01-15' })
  @IsDateString()
  @IsOptional()
  po_approval_date?: string;

  @ApiPropertyOptional({ description: 'Hotel need by date', example: '2024-02-01' })
  @IsDateString()
  @IsOptional()
  hotel_need_by_date?: string;

  @ApiPropertyOptional({ description: 'Expected delivery date', example: '2024-03-01' })
  @IsDateString()
  @IsOptional()
  expected_delivery?: string;
}

