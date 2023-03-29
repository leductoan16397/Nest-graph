import { FilterQuery, Model, ProjectionType } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { readFileSync } from 'node:fs';
import { csv2jsonAsync } from 'json-2-csv';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async create(createUserInput: CreateUserInput) {
    try {
      const user = new this.userModel(createUserInput);
      return await user.save();
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
    projection?: ProjectionType<User>;
    filter?: FilterQuery<User>;
  }) {
    try {
      const users =
        (!!page &&
          !!perPage &&
          (await this.userModel
            .find(filter, projection)
            .limit(perPage)
            .skip(perPage * (page - 1)))) ||
        (await this.userModel.find(filter, projection));
      if (users.length === 0) {
        return 'user not found';
      }
      return users;
    } catch (error) {
      return new Error(error.message);
    }
  }

  async findOne(filter: FilterQuery<User> = {}) {
    try {
      const user = await this.userModel.findOne(filter).exec();
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
      return await this.userModel.findByIdAndUpdate(id, updateUserInput, {
        new: true,
        upsert: true,
      });
    } catch (error) {
      return new Error(error.message);
    }
  }

  async findByIdAndDelete(id: string) {
    try {
      return await this.userModel.findByIdAndDelete(id);
    } catch (error) {
      return new Error(error.message);
    }
  }

  async initUsers() {
    try {
      const users = await csv2jsonAsync(
        readFileSync('./dataa/user.csv').toString(),
      );
      return await this.userModel.insertMany(users);
    } catch (error) {
      return new Error(error.message);
    }
  }
}
