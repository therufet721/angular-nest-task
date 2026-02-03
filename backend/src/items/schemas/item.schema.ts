import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { Category } from './category.schema';

export type ItemDocument = Item & Document;

@Schema({ timestamps: true })
export class Item {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ default: 0 })
  quantity: number;

  @Prop({ type: Types.ObjectId, ref: 'Category' })
  category: Category | Types.ObjectId;
}

export const ItemSchema = SchemaFactory.createForClass(Item);

// Add pagination plugin
ItemSchema.plugin(mongoosePaginate);
