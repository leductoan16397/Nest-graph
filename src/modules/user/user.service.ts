import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { readFileSync } from 'node:fs';
import { csv2jsonAsync } from 'json-2-csv';
import { PrismaService } from '../common/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createUserInput: CreateUserInput) {
    try {
      const user = await this.prismaService.user.create({
        data: {
          address: createUserInput.address,
          age: createUserInput.age,
          avatar: createUserInput.avatar,
          firstName: createUserInput.firstName,
          lastName: createUserInput.lastName,
          sex: createUserInput.sex,
        },
      });
      return user;
    } catch (error) {
      return new Error(error.message);
    }
  }

  async find({
    page = 1,
    perPage = 10,
    projection,
    filter = {},
  }: {
    page?: number;
    perPage?: number;
    projection?: Prisma.UserSelect;
    filter?: Prisma.UserWhereInput;
  }) {
    try {
      const users = await this.prismaService.user.findMany({
        where: filter,
        select: projection,
        skip: perPage * (page - 1),
        take: perPage,
      });
      if (users.length === 0) {
        console.log('user not found');
        return [];
      }
      return users;
    } catch (error) {
      return new Error(error.message);
    }
  }

  async findOne(filter: Prisma.UserWhereInput = {}) {
    try {
      const user = await this.prismaService.user.findFirst({ where: filter });
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
      await this.prismaService.user.update({
        where: { id },
        data: updateUserInput,
      });

      return await this.prismaService.user.findFirst({ where: { id } });
    } catch (error) {
      return new Error(error.message);
    }
  }

  async findByIdAndDelete(id: number) {
    try {
      const a = await this.prismaService.user.delete({ where: { id } });
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

      return await this.prismaService.user.createMany({ data: users });
    } catch (error) {
      return new Error(error.message);
    }
  }
}
