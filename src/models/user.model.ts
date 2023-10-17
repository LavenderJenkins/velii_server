import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import {UserStatus} from "src/constants";


export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  _id: string;
  
  @Prop({ required: true })
  full_name: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true, default: UserStatus.UnActive })
  status: number;
  
  @Prop({ required: true })
  password: string;
  
  @Prop({default: ''})
  avatar: string;

  @Prop({default: ['member']})
  roles: [string];
};

export const UserSchema = SchemaFactory.createForClass(User);
