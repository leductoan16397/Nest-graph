import { ObjectType, Field, Int } from '@nestjs/graphql';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
@ObjectType()
export class User {
  @Field(() => String)
  _id: MongooseSchema.Types.ObjectId;

  @Prop()
  @Field(() => String, {})
  firstName: string;

  @Prop()
  @Field(() => String, {})
  sex: string;

  @Prop()
  @Field(() => String, {})
  lastName: string;

  @Prop()
  @Field(() => Int, {})
  age: number;

  @Prop()
  @Field(() => String, {})
  address: string;

  @Prop()
  @Field(() => String, {})
  avatar: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
