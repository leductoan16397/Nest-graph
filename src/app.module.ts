import { ApolloDriver } from '@nestjs/apollo';
import { ApolloDriverConfig } from '@nestjs/apollo/dist/interfaces';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './modules/common/common.module';
import * as depthLimit from 'graphql-depth-limit';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { BlogModule } from './modules/blog/blog.module';
import DatabaseLogger from './modules/common/databaseLogger';

@Module({
  imports: [
    CommonModule,
    TypeOrmModule.forRoot({
      type: 'mongodb',
      host: 'localhost',
      // port: 27017,
      database: 'BlogType',
      synchronize: true,
      autoLoadEntities: true,
      logging: true,
      logger: new DatabaseLogger(),
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      debug: true,
      playground: true,
      autoSchemaFile: join(process.cwd(), 'schema.graphql'),
      sortSchema: true,
      logger: console,
      validationRules: [depthLimit(2)],
    }),
    BlogModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
