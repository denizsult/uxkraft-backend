import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ItemsController } from './items.controller';
import { ItemsCoreService } from './services/items-core.service';
import { ItemPlanningService } from './services/item-planning.service';
import { ItemProductionService } from './services/item-production.service';
import { ItemShippingService } from './services/item-shipping.service';
import { ItemOrchestratorService } from './services/item-orchestrator.service';
import { Item } from './models/item.model';
import { ItemPlanning } from './models/item-planning.model';
import { ItemProduction } from './models/item-production.model';
import { ItemShipping } from './models/item-shipping.model';

@Module({
  imports: [
    SequelizeModule.forFeature([Item, ItemPlanning, ItemProduction, ItemShipping]),
  ],
  controllers: [ItemsController],
  providers: [
    ItemsCoreService,
    ItemPlanningService,
    ItemProductionService,
    ItemShippingService,
    ItemOrchestratorService,
  ],
  exports: [
    ItemsCoreService,
    ItemPlanningService,
    ItemProductionService,
    ItemShippingService,
    ItemOrchestratorService,
  ],
})
export class ItemsModule {}

