import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { User, UserSchema } from './entities/user.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogModule } from '../blog/blog.module';

@Module({
  imports: [
    forwardRef(() => BlogModule),
    // BlogModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UserResolver, UserService],
  exports: [UserService, MongooseModule],
})
export class UserModule {}
