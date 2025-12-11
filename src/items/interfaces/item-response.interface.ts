import { Item } from '../models/item.model';
import { ItemPlanning } from '../models/item-planning.model';
import { ItemProduction } from '../models/item-production.model';
import { ItemShipping } from '../models/item-shipping.model';

export type ItemWithRelations = Item & {
  planning?: ItemPlanning;
  production?: ItemProduction;
  shipping?: ItemShipping;
};

