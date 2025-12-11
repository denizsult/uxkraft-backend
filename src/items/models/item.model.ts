import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  HasOne,
  CreatedAt,
  UpdatedAt,
  Index,
} from 'sequelize-typescript';
import { ItemPlanning } from './item-planning.model';
import { ItemProduction } from './item-production.model';
import { ItemShipping } from './item-shipping.model';

@Table({
  tableName: 'items',
  timestamps: true,
})
export class Item extends Model<Item> {
  @PrimaryKey
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    autoIncrement: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  spec_number: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  item_name: string;

  @Index
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  ship_from: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  ship_to: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
    },
  })
  qty: number;

  @Index
  @Column({
    type: DataType.STRING,
    allowNull: true,
    comment: 'Phase as numeric string: 1, 2, 3, 4',
  })
  phase: string;

  @Default(0)
  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: false,
  })
  price: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  ship_notes: string;

  @Index
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  location: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  category: string;

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

  @HasOne(() => ItemPlanning, 'item_id')
  planning: ItemPlanning;

  @HasOne(() => ItemProduction, 'item_id')
  production: ItemProduction;

  @HasOne(() => ItemShipping, 'item_id')
  shipping: ItemShipping;
}

