import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from 'sequelize';
import { ItemPlanning } from '../models/item-planning.model';
import { UpdatePlanningDto } from '../dto/update-planning.dto';

@Injectable()
export class ItemPlanningService {
  constructor(
    @InjectModel(ItemPlanning)
    private itemPlanningModel: typeof ItemPlanning,
  ) {}

  private parseDate(dateString?: string): Date | null {
    return dateString ? new Date(dateString) : null;
  }

  async create(itemId: number, dto?: UpdatePlanningDto, transaction?: Transaction) {
    const data = {
      item_id: itemId,
      po_approval_date: dto?.po_approval_date
        ? this.parseDate(dto.po_approval_date)
        : null,
      hotel_need_by_date: dto?.hotel_need_by_date
        ? this.parseDate(dto.hotel_need_by_date)
        : null,
      expected_delivery: dto?.expected_delivery
        ? this.parseDate(dto.expected_delivery)
        : null,
    };

    return await this.itemPlanningModel.create(data as any, { transaction });
  }

  async findOne(itemId: number, transaction?: Transaction) {
    return await this.itemPlanningModel.findOne({
      where: { item_id: itemId },
      transaction,
    });
  }

  async createOrUpdate(itemId: number, dto: UpdatePlanningDto, transaction?: Transaction) {
    const existing = await this.findOne(itemId, transaction);

    if (!existing) {
      return await this.create(itemId, dto, transaction);
    }

    await existing.update(
      {
        po_approval_date: dto.po_approval_date
          ? this.parseDate(dto.po_approval_date)
          : existing.po_approval_date ?? null,
        hotel_need_by_date: dto.hotel_need_by_date
          ? this.parseDate(dto.hotel_need_by_date)
          : existing.hotel_need_by_date ?? null,
        expected_delivery: dto.expected_delivery
          ? this.parseDate(dto.expected_delivery)
          : existing.expected_delivery ?? null,
      } as any,
      { transaction },
    );

    return existing;
  }
}

