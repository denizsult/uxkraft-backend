import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Item } from '../items/models/item.model';
import { ItemPlanning } from '../items/models/item-planning.model';
import { ItemProduction } from '../items/models/item-production.model';
import { ItemShipping } from '../items/models/item-shipping.model';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        dialect: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USERNAME', 'postgres'),
        password: configService.get<string>('DB_PASSWORD', 'postgres'),
        database: configService.get<string>('DB_DATABASE', 'case_study'),
        models: [Item, ItemPlanning, ItemProduction, ItemShipping],
        autoLoadModels: true,
        synchronize: configService.get<string>('NODE_ENV') !== 'production', // Use migrations in production
        logging: configService.get<string>('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}

