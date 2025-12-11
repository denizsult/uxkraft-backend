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
  tableName: 'item_shipping',
  timestamps: true,
})
export class ItemShipping extends Model<ItemShipping> {
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
    field: 'ordered_date',
  })
  ordered_date: Date;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
    field: 'shipped_date',
  })
  shipped_date: Date;

  @Index
  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
    field: 'delivered_date',
  })
  delivered_date: Date;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'shipping_notes',
  })
  shipping_notes: string;

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

