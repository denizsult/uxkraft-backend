import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from 'sequelize';
import { ItemProduction } from '../models/item-production.model';
import { UpdateProductionDto } from '../dto/update-production.dto';

@Injectable()
export class ItemProductionService {
  constructor(
    @InjectModel(ItemProduction)
    private itemProductionModel: typeof ItemProduction,
  ) {}

  private parseDate(dateString?: string): Date | null {
    return dateString ? new Date(dateString) : null;
  }

  async create(itemId: number, dto?: UpdateProductionDto, transaction?: Transaction) {
    const data = {
      item_id: itemId,
      cfa_shops_send: dto?.cfa_shops_send ? this.parseDate(dto.cfa_shops_send) : null,
      cfa_shops_approved: dto?.cfa_shops_approved
        ? this.parseDate(dto.cfa_shops_approved)
        : null,
      cfa_shops_delivered: dto?.cfa_shops_delivered
        ? this.parseDate(dto.cfa_shops_delivered)
        : null,
    };

    return await this.itemProductionModel.create(data as any, { transaction });
  }

  async findOne(itemId: number, transaction?: Transaction) {
    return await this.itemProductionModel.findOne({
      where: { item_id: itemId },
      transaction,
    });
  }

  async createOrUpdate(itemId: number, dto: UpdateProductionDto, transaction?: Transaction) {
    const existing = await this.findOne(itemId, transaction);

    if (!existing) {
      return await this.create(itemId, dto, transaction);
    }

    await existing.update(
      {
        cfa_shops_send: dto.cfa_shops_send
          ? this.parseDate(dto.cfa_shops_send)
          : existing.cfa_shops_send ?? null,
        cfa_shops_approved: dto.cfa_shops_approved
          ? this.parseDate(dto.cfa_shops_approved)
          : existing.cfa_shops_approved ?? null,
        cfa_shops_delivered: dto.cfa_shops_delivered
          ? this.parseDate(dto.cfa_shops_delivered)
          : existing.cfa_shops_delivered ?? null,
      } as any,
      { transaction },
    );

    return existing;
  }
}

