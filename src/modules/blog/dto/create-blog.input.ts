import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateBlogInput {
  @Field(() => String, { description: 'Blog Title', nullable: false })
  title: string;

  @Field(() => String, { description: 'Blog Description', nullable: false })
  description: string;

  @Field(() => String, { description: 'Blog content', nullable: false })
  content: string;

  @Field(() => Int, { description: 'Blog owner', nullable: false })
  owner: number;
}
