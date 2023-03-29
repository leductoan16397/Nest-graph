import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateBlogInput {
  @Field(() => String, { description: 'Blog Title' })
  title: string;

  @Field(() => String, { description: 'Blog Description' })
  description: string;

  @Field(() => String, { description: 'Blog content' })
  content: string;

  @Field(() => String, { description: 'Blog owner' })
  owner: string;
}
