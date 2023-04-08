import { BlogModule } from './../blog/blog.module';
import { Module, forwardRef } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentResolver } from './comment.resolver';
import { Comment } from './entities/comment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() => BlogModule),
    TypeOrmModule.forFeature([Comment]),
  ],
  providers: [CommentResolver, CommentService],
  exports: [CommentService, TypeOrmModule],
})
export class CommentModule {}
