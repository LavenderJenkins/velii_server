import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';

@Schema()
export class Cart {

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  user_id: string;

  @Prop([{ type: SchemaTypes.ObjectId, ref: 'Document' }])
  cart_items: string[];

  @Prop({ default: Date.now })
  created_at: Date;

  @Prop({ default: Date.now })
  modified_at: Date;



}

export const CartSchema = SchemaFactory.createForClass(Cart);