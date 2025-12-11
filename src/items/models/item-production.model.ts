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
} from 'sequelize-typescript';
import { Item } from './item.model';

@Table({
  tableName: 'item_production',
  timestamps: true,
})
export class ItemProduction extends Model<ItemProduction> {
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
    field: 'cfa_shops_send',
  })
  cfa_shops_send: Date;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
    field: 'cfa_shops_approved',
  })
  cfa_shops_approved: Date;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
    field: 'cfa_shops_delivered',
  })
  cfa_shops_delivered: Date;

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

