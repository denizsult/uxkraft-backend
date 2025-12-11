import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from 'sequelize';
import { Item } from '../models/item.model';
import { ItemsCoreService } from './items-core.service';
import { ItemPlanningService } from './item-planning.service';
import { ItemProductionService } from './item-production.service';
import { ItemShippingService } from './item-shipping.service';
import { UpdatePlanningDto } from '../dto/update-planning.dto';
import { UpdateProductionDto } from '../dto/update-production.dto';
import { UpdateShippingDto } from '../dto/update-shipping.dto';
import { BulkUpdateItemsDto } from '../dto/bulk-update-items.dto';
import { BulkUpdateTrackingDto } from '../dto/bulk-update-tracking.dto';
import { BulkOperationResult, ItemWithRelations } from '../interfaces';
import { ItemPlanning } from '../models/item-planning.model';
import { ItemProduction } from '../models/item-production.model';
import { ItemShipping } from '../models/item-shipping.model';

@Injectable()
export class ItemOrchestratorService {
  constructor(
    @InjectModel(Item)
    private itemModel: typeof Item,
    private itemsCoreService: ItemsCoreService,
    private itemPlanningService: ItemPlanningService,
    private itemProductionService: ItemProductionService,
    private itemShippingService: ItemShippingService,
    @InjectModel(ItemPlanning)
    private itemPlanningModel: typeof ItemPlanning,
    @InjectModel(ItemProduction)
    private itemProductionModel: typeof ItemProduction,
    @InjectModel(ItemShipping)
    private itemShippingModel: typeof ItemShipping,
  ) {}

  private getSequelize() {
    if (!this.itemModel.sequelize) {
      throw new Error('Sequelize instance is not available');
    }
    return this.itemModel.sequelize;
  }

 

  async updatePlanning(
    itemId: number,
    updatePlanningDto: UpdatePlanningDto,
  ): Promise<ItemWithRelations> {
    await this.itemsCoreService.findOne(itemId);
    await this.itemPlanningService.createOrUpdate(itemId, updatePlanningDto);
    return this.itemsCoreService.findOne(itemId);
  }

  async updateProduction(
    itemId: number,
    updateProductionDto: UpdateProductionDto,
  ): Promise<ItemWithRelations> {
    await this.itemsCoreService.findOne(itemId);
    await this.itemProductionService.createOrUpdate(
      itemId,
      updateProductionDto,
    );
    return this.itemsCoreService.findOne(itemId);
  }

  async updateShipping(
    itemId: number,
    updateShippingDto: UpdateShippingDto,
  ): Promise<ItemWithRelations> {
    await this.itemsCoreService.findOne(itemId);
    const shippingRecord = await this.itemShippingService.createOrUpdate(
      itemId,
      updateShippingDto,
    );

    // Automatically update phase to DELIVERED when delivered_date is set
    if (updateShippingDto.delivered_date || shippingRecord?.delivered_date) {
      await this.itemsCoreService.updatePhase(itemId, '4'); // Delivered phase
    }

    return this.itemsCoreService.findOne(itemId);
  }

  async bulkUpdateItems(
    bulkUpdateItemsDto: BulkUpdateItemsDto,
  ): Promise<BulkOperationResult> {
    const { item_ids, location, category, ship_from, ship_notes } =
      bulkUpdateItemsDto;

    if (!item_ids?.length) {
      throw new BadRequestException('At least one item ID must be provided');
    }

    if (!location && !category && !ship_from && !ship_notes) {
      throw new BadRequestException(
        'At least one field (location, category, ship_from, or ship_notes) must be provided',
      );
    }

    const t = await this.getSequelize().transaction();

    try {
      const updateData: any = {};

      if (location !== undefined) updateData.location = location;
      if (category !== undefined) updateData.category = category;
      if (ship_from !== undefined) updateData.ship_from = ship_from;
      if (ship_notes !== undefined) updateData.ship_notes = ship_notes;

      /* bulk update items */
      const [affectedCount] = await this.itemModel.update(updateData, {
        where: { id: item_ids },
        transaction: t,
      });

      await t.commit();

      return {
        message: `Successfully updated ${affectedCount} item(s)`,
        successCount: affectedCount,
      };
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  async bulkUpdateTracking(dto: BulkUpdateTrackingDto) {
    const { item_ids, planning, production, shipping } = dto;

    if (!item_ids?.length) {
      throw new BadRequestException('item_ids is required');
    }

    const t = await this.getSequelize().transaction();

    try {
      /* this function is used to bulk insert or update data in the database */
      const bulkUpsertPg = async (model, payload) => {
        if (!payload || !Object.values(payload).some((v) => v !== undefined))
          return;

        const rows = item_ids.map((id) => ({
          item_id: id,
          ...payload,
        }));

        await model.bulkCreate(rows, {
          updateOnDuplicate: Object.keys(payload),
          transaction: t,
        });
      };

      await bulkUpsertPg(this.itemPlanningModel, planning);
      await bulkUpsertPg(this.itemProductionModel, production);
      await bulkUpsertPg(this.itemShippingModel, shipping);

      if (shipping?.delivered_date) {
        await this.itemModel.update(
          { phase: '4' },
          { where: { id: item_ids }, transaction: t },
        );
      }

      await t.commit();

      return {
        successCount: item_ids.length,
        message: `Updated ${item_ids.length} items`,
      };
    } catch (e) {
      await t.rollback();
      throw e;
    }
  }
}
