import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { readFileSync } from 'node:fs';
import { csv2jsonAsync } from 'json-2-csv';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindOneOptions,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserInput: CreateUserInput) {
    try {
      const user = new User({
        address: createUserInput.address,
        age: createUserInput.age,
        avatar: createUserInput.avatar,
        firstName: createUserInput.firstName,
        lastName: createUserInput.lastName,
        sex: createUserInput.sex,
      });
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

  async findOne(filter: FindOneOptions<User> = {}) {
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

  async findByIdAndUpdate(id: number, updateUserInput: UpdateUserInput) {
    try {
      await this.userRepository.update(id, updateUserInput);

      return await this.userRepository.findOneBy({ id });
    } catch (error) {
      return new Error(error.message);
    }
  }

  async findByIdAndDelete(id: number) {
    try {
      const a = await this.userRepository.delete(id);
      return a;
    } catch (error) {
      return new Error(error.message);
    }
  }

  async initUsers() {
    try {
      const users = await csv2jsonAsync(
        readFileSync('./dataa/user.csv').toString(),
      );
      return await this.userRepository.insert(users);
    } catch (error) {
      return new Error(error.message);
    }
  }
}
