import { CreateBlogInput } from './create-blog.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateBlogInput extends PartialType(CreateBlogInput) {
  @Field(() => String)
  id: string;
}
