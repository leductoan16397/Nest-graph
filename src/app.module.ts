import { ApolloDriver } from '@nestjs/apollo';
import { ApolloDriverConfig } from '@nestjs/apollo/dist/interfaces';
import { Module, OnModuleInit } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlogModule } from './modules/blog/blog.module';
import { UserModule } from './modules/user/user.module';
import * as mongoose from 'mongoose';
import { CommonModule } from './modules/common/common.module';
import * as depthLimit from 'graphql-depth-limit';

@Module({
  imports: [
    CommonModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      debug: true,
      playground: true,
      autoSchemaFile: join(process.cwd(), 'schema.graphql'),
      sortSchema: true,
      logger: console,
      validationRules: [depthLimit(2)],
    }),
    MongooseModule.forRoot('mongodb://localhost:27017/Blog', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      authMechanism: 'DEFAULT',
    }),
    BlogModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  onModuleInit() {
    mongoose.set('debug', true);
  }
}
