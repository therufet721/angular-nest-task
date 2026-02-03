import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Item, ItemSchema } from './schemas/item.schema';
import { Category, CategorySchema } from './schemas/category.schema';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Item.name, schema: ItemSchema },
      { name: Category.name, schema: CategorySchema },
    ]),
  ],
  providers: [ItemsService],
  controllers: [ItemsController],
})
export class ItemsModule {}
