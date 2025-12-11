import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from 'sequelize';
import { ItemShipping } from '../models/item-shipping.model';
import { UpdateShippingDto } from '../dto/update-shipping.dto';

@Injectable()
export class ItemShippingService {
  constructor(
    @InjectModel(ItemShipping)
    private itemShippingModel: typeof ItemShipping,
  ) {}

  private parseDate(dateString?: string): Date | null {
    return dateString ? new Date(dateString) : null;
  }

  async create(itemId: number, dto?: UpdateShippingDto, transaction?: Transaction) {
    const data = {
      item_id: itemId,
      ordered_date: dto?.ordered_date ? this.parseDate(dto.ordered_date) : null,
      shipped_date: dto?.shipped_date ? this.parseDate(dto.shipped_date) : null,
      delivered_date: dto?.delivered_date ? this.parseDate(dto.delivered_date) : null,
      shipping_notes: dto?.shipping_notes || null,
    };

    return await this.itemShippingModel.create(data as any, { transaction });
  }

  async findOne(itemId: number, transaction?: Transaction) {
    return await this.itemShippingModel.findOne({
      where: { item_id: itemId },
      transaction,
    });
  }

  async createOrUpdate(itemId: number, dto: UpdateShippingDto, transaction?: Transaction) {
    const existing = await this.findOne(itemId, transaction);

    if (!existing) {
      const created = await this.create(itemId, dto, transaction);
      return created;
    }

    const data = {
      ordered_date: dto.ordered_date ? this.parseDate(dto.ordered_date) : null,
      shipped_date: dto.shipped_date ? this.parseDate(dto.shipped_date) : null,
      delivered_date: dto.delivered_date ? this.parseDate(dto.delivered_date) : null,
      shipping_notes: dto.shipping_notes !== undefined ? dto.shipping_notes : null,
    };

    await existing.update(data as any, { transaction });

    return existing;
  }
}

