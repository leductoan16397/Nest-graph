import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { User } from './entities/user.entity';
import { BlogModule } from '../blog/blog.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [forwardRef(() => BlogModule), TypeOrmModule.forFeature([User])],
  providers: [UserResolver, UserService],
  exports: [UserService, TypeOrmModule],
})
export class UserModule {}
