import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { readFileSync } from 'node:fs';
import { csv2jsonAsync } from 'json-2-csv';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindOptionsSelect,
  FindOptionsWhere,
  MongoRepository,
  ObjectID,
} from 'typeorm';
import { MongoFindOneOptions } from 'typeorm/find-options/mongodb/MongoFindOneOptions';
import { ObjectId } from 'mongodb';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: MongoRepository<User>,
  ) {}

  async create(createUserInput: CreateUserInput) {
    try {
      const user = new User(createUserInput);
      return await this.userRepository.save(user);
    } catch (error) {
      return new Error(error.message);
    }
  }

  async find({
    page,
    perPage,
    projection,
    filter = {},
  }: {
    page?: number;
    perPage?: number;
    projection?: FindOptionsSelect<User>;
    filter?: FindOptionsWhere<User>;
  }) {
    try {
      const users =
        (!!page &&
          !!perPage &&
          (await this.userRepository.find({
            where: filter,
            select: projection,
            skip: perPage * (page - 1),
            take: perPage,
          }))) ||
        (await this.userRepository.find({ where: filter, select: projection }));
      if (users.length === 0) {
        return 'user not found';
      }
      return users;
    } catch (error) {
      return new Error(error.message);
    }
  }

  async findOne(filter: MongoFindOneOptions<User> = {}) {
    try {
      const user = await this.userRepository.findOne(filter);
      if (!user) {
        return 'user not found';
      }
      return user;
    } catch (error) {
      return new Error(error.message);
    }
  }

  async findByIdAndUpdate(id: string, updateUserInput: UpdateUserInput) {
    try {
      await this.userRepository.updateOne(
        { _id: new ObjectId(id) },
        { $set: { lastName: updateUserInput.lastName } },
        {
          upsert: true,
        },
      );

      return await this.userRepository.findOneBy(id);
    } catch (error) {
      return new Error(error.message);
    }
  }

  async findByIdAndDelete(id: ObjectID) {
    try {
      const a = await this.userRepository.findOneAndDelete({ _id: id });
      return a.value;
    } catch (error) {
      return new Error(error.message);
    }
  }

  async initUsers() {
    try {
      const users = await csv2jsonAsync(
        readFileSync('./dataa/user.csv').toString(),
      );
      return await this.userRepository.insertMany(users);
    } catch (error) {
      return new Error(error.message);
    }
  }
}
