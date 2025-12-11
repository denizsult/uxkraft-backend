import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Item } from '../models/item.model';
import { ItemPlanning } from '../models/item-planning.model';
import { ItemProduction } from '../models/item-production.model';
import { ItemShipping } from '../models/item-shipping.model';
import { ItemWithRelations } from '../interfaces';
import { Parser } from 'json2csv';

@Injectable()
export class ItemsCoreService {
  constructor(
    @InjectModel(Item)
    private itemModel: typeof Item,
  ) {}

  async findAll(): Promise<ItemWithRelations[]> {
    return await this.itemModel.findAll({
      include: [
        { model: ItemPlanning, required: false },
        { model: ItemProduction, required: false },
        { model: ItemShipping, required: false },
      ],
      order: [['id', 'ASC']],
    });
  }

  async findOne(id: number): Promise<ItemWithRelations> {
    const item = await this.itemModel.findByPk(id, {
      include: [
        { model: ItemPlanning, required: false },
        { model: ItemProduction, required: false },
        { model: ItemShipping, required: false },
      ],
    });

    if (!item) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }

    return item;
  }

  async findByPk(id: number, transaction?: any) {
    return await this.itemModel.findByPk(id, { transaction });
  }

  async updatePhase(id: number, phase: string, transaction?: any) {
    const item = await this.findByPk(id, transaction);
    if (!item) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }
    
    // Validate phase
    const validPhases = ['1', '2', '3', '4'];
    if (phase && !validPhases.includes(phase)) {
      throw new BadRequestException(
        `Invalid phase value. Must be one of: ${validPhases.join(', ')}`,
      );
    }
    
    await item.update({ phase }, { transaction });
    return item;
  }

  async exportToCsv(): Promise<string> {
    const items = await this.findAll()

    if (items.length === 0) {
      throw new BadRequestException('No items found');
    }

    // Convert Sequelize models to plain objects and map to CSV format
    const csvData = items.map((item) => {
      const plainItem = item.get({ plain: true });
      return {
        ID: plainItem.id,
        'Spec Number': plainItem.spec_number || '',
        'Item Name': plainItem.item_name || '',
        'Ship From': plainItem.ship_from || '',
        'Ship To': plainItem.ship_to || '',
        Quantity: plainItem.qty || 0,
        Phase: plainItem.phase || '',
        Price: plainItem.price || 0,
        'Ship Notes': plainItem.shipping?.shipping_notes || '',
        Location: plainItem.location || '',
        Category: plainItem.category || '',
        'Created At': plainItem.created_at 
          ? new Date(plainItem.created_at).toISOString() 
          : '',
        'Updated At': plainItem.updated_at 
          ? new Date(plainItem.updated_at).toISOString() 
          : '',
      };
    });

    // CSV Headers
    const headers = [
      'ID',
      'Spec Number',
      'Item Name',
      'Ship From',
      'Ship To',
      'Quantity',
      'Phase',
      'Price',
      'Ship Notes',
      'Location',
      'Category',
      'Created At',
      'Updated At',
    ];

    const parser = new Parser({ headers });
    const csv = parser.parse(csvData);
    return csv;
  }
}

