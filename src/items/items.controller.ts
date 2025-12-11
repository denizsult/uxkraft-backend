import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Get,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  Res,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import * as express from 'express';
import { ItemOrchestratorService } from './services/item-orchestrator.service';
import { UpdatePlanningDto } from './dto/update-planning.dto';
import { UpdateProductionDto } from './dto/update-production.dto';
import { UpdateShippingDto } from './dto/update-shipping.dto';
import { BulkUpdateItemsDto } from './dto/bulk-update-items.dto';
import { BulkUpdateTrackingDto } from './dto/bulk-update-tracking.dto';
import { ItemWithRelations, BulkOperationResult } from './interfaces';
import { ItemsCoreService } from './services/items-core.service';

@ApiTags('items')
@Controller('items')
export class ItemsController {
  constructor(
    private readonly itemOrchestratorService: ItemOrchestratorService,
    private readonly itemsCoreService: ItemsCoreService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all items' })
  @ApiOkResponse({
    description: 'Items retrieved successfully',
    type: Array, // ItemWithRelations[]
  })
  findAll(): Promise<ItemWithRelations[]> {
    return this.itemsCoreService.findAll();
  }

  @Get('export')
  @ApiOperation({ summary: 'Export all items as CSV' })
  @ApiOkResponse({
    description: 'CSV file exported successfully',
    content: {
      'text/csv': {
        schema: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async exportToCsv(@Res() res: express.Response): Promise<void> {
    const csvContent = await this.itemsCoreService.exportToCsv();
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="items-export.csv"');
    res.send(csvContent);
  }

  @Post(':id/planning-requirements')
  @ApiOperation({ summary: 'Create or update planning requirements for an item' })
  @ApiCreatedResponse({
    description: 'Planning requirements have been successfully created/updated',
    type: Object, // ItemWithRelations
  })
  @ApiResponse({ status: 404, description: 'Item not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiParam({ name: 'id', description: 'Item ID', type: Number })
  createOrUpdatePlanning(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePlanningDto: UpdatePlanningDto,
  ): Promise<ItemWithRelations> {
    return this.itemOrchestratorService.updatePlanning(id, updatePlanningDto);
  }

  @Post(':id/production-shop')
  @ApiOperation({ summary: 'Create or update production & shop data for an item' })
  @ApiCreatedResponse({
    description: 'Production & shop data have been successfully created/updated',
    type: Object, // ItemWithRelations
  })
  @ApiResponse({ status: 404, description: 'Item not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiParam({ name: 'id', description: 'Item ID', type: Number })
  createOrUpdateProduction(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductionDto: UpdateProductionDto,
  ): Promise<ItemWithRelations> {
    return this.itemOrchestratorService.updateProduction(id, updateProductionDto);
  }

  @Post(':id/shipping')
  @ApiOperation({ summary: 'Create or update shipping data for an item' })
  @ApiCreatedResponse({
    description: 'Shipping data have been successfully created/updated',
    type: Object, // ItemWithRelations
  })
  @ApiResponse({ status: 404, description: 'Item not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiParam({ name: 'id', description: 'Item ID', type: Number })
  createOrUpdateShipping(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateShippingDto: UpdateShippingDto,
  ): Promise<ItemWithRelations> {
    return this.itemOrchestratorService.updateShipping(id, updateShippingDto);
  }

  @Patch('bulk')
  @ApiOperation({ summary: 'Bulk update items (location and category)' })
  @ApiOkResponse({
    description: 'Items have been successfully updated',
    type: Object, // BulkOperationResult
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @HttpCode(HttpStatus.OK)
  bulkUpdateItems(
    @Body() bulkUpdateItemsDto: BulkUpdateItemsDto,
  ): Promise<BulkOperationResult> {
    return this.itemOrchestratorService.bulkUpdateItems(bulkUpdateItemsDto);
  }

  @Patch('bulk/update-tracking')
  @ApiOperation({
    summary: 'Bulk update tracking data (planning, production, shipping)',
  })
  @ApiOkResponse({
    description: 'Tracking data has been successfully updated',
    type: Object, // BulkOperationResult
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @HttpCode(HttpStatus.OK)
  bulkUpdateTracking(
    @Body() bulkUpdateTrackingDto: BulkUpdateTrackingDto,
  ): Promise<BulkOperationResult> {
    return this.itemOrchestratorService.bulkUpdateTracking(
      bulkUpdateTrackingDto,
    );
  }
}
