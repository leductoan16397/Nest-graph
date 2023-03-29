import { ObjectType, Field } from '@nestjs/graphql';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from 'src/modules/user/entities/user.entity';

@Schema()
@ObjectType()
export class Comment {
  @Prop()
  @Field(() => String)
  content: string;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }] })
  @Field(() => String)
  owner: User;
}
export const CommentSchema = SchemaFactory.createForClass(Comment);

export type BlogDocument = HydratedDocument<Blog>;

@Schema()
@ObjectType()
export class Blog {
  @Field(() => String)
  _id: MongooseSchema.Types.ObjectId;

  @Prop()
  @Field(() => String, {})
  content: string;

  @Prop()
  @Field(() => String, {
    description: 'Blog Title',
    nullable: true,
    defaultValue: '',
  })
  title: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  @Field(() => User, { nullable: true })
  owner: User | MongooseSchema.Types.ObjectId;

  @Prop()
  @Field(() => String, { description: 'Blog Description' })
  description: string;

  @Prop([CommentSchema])
  @Field(() => Comment)
  comments: Comment[];
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
