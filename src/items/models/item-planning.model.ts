import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  ForeignKey,
  BelongsTo,
  CreatedAt,
  UpdatedAt,
  Index,
} from 'sequelize-typescript';
import { Item } from './item.model';

@Table({
  tableName: 'item_planning',
  timestamps: true,
})
export class ItemPlanning extends Model<ItemPlanning> {
  @PrimaryKey
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    autoIncrement: true,
  })
  declare id: number;

  @ForeignKey(() => Item)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    unique: true,
    field: 'item_id',
  })
  item_id: number;

  @BelongsTo(() => Item, 'item_id')
  item: Item;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
    field: 'po_approval_date',
  })
  po_approval_date: Date;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
    field: 'hotel_need_by_date',
  })
  hotel_need_by_date: Date;

  @Index
  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
    field: 'expected_delivery',
  })
  expected_delivery: Date;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    field: 'created_at',
  })
  created_at: Date;

  @UpdatedAt
  @Column({
    type: DataType.DATE,
    field: 'updated_at',
  })
  updated_at: Date;
}

