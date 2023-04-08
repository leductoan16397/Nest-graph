import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateCommentInput {
  @Field(() => String, { description: 'Example field (placeholder)' })
  content: string;

  @Field(() => Int, { description: 'Example field (placeholder)' })
  blogId: number;

  @Field(() => Int, { description: 'Example field (placeholder)' })
  ownerId: number;
}
