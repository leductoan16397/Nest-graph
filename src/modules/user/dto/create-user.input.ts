import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
  @Field(() => String, {})
  sex: string;

  @Field(() => String, {})
  firstName: string;

  @Field(() => String, {})
  lastName: string;

  @Field(() => Int, {})
  age: number;

  @Field(() => String, {})
  address: string;

  @Field(() => String, { nullable: true })
  avatar: string;
}
