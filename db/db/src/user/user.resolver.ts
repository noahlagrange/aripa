import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './user.entity';
import { NotFoundException } from '@nestjs/common';
import { Int } from '@nestjs/graphql';
import { Tax } from '../tax/tax.entity';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [User])
  users() {
    return this.userService.findAll();
  }

  @Mutation(() => User)
  async updateUser(
    @Args('id', { type: () => Int }) id: number,
    @Args('name') name: string,
    @Args('email') email: string,
    @Args('phone') phone: string,
  ): Promise<User> {
    const user = await this.userService.findById(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    const updatedUser = await this.userService.updateUser(id, name, email, phone);
    if (!updatedUser) {
      throw new NotFoundException(`Failed to update user with id ${id}`);
    }
    return updatedUser;
  }
  @Mutation(() => User)
  createUser(
    @Args('name') name: string,
    @Args('email') email: string,
    @Args('phone') phone: string,
  ): Promise<User> {
    return this.userService.createUser(name, email, phone);
  }

  @Mutation(() => User)
  async addBoatToUser(
    @Args('userId', { type: () => Int }) userId: number,
    @Args('boatId', { type: () => Int }) boatId: number,
  ): Promise<User> {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    const updatedUser = await this.userService.addBoatToUser(userId, boatId);
    if (!updatedUser) {
      throw new NotFoundException(`Boat with id ${boatId} not found`);
    }
    return updatedUser;
  }

  @Mutation(() => User)
  async removeBoatFromUser(
    @Args('userId',  { type: () => Int }) userId: number,
    @Args('boatId', { type: () => Int }) boatId: number,
  ): Promise<User> {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    const updatedUser = await this.userService.removeBoatFromUser(userId, boatId);
    if (!updatedUser) {
      throw new NotFoundException(`Boat with id ${boatId} not found`);
    }
    return updatedUser;
  }

  @Mutation(() => User)
  async deleteUser(@Args('id', { type: () => Int }) id: number): Promise<User> {
    const user = await this.userService.deleteUsers(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  @Query(() => User)
  async user(@Args('id', { type: () => Int }) id: number): Promise<User> {
    const user = await this.userService.findById(id);
    if
    (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  @Query(() => [Tax], { nullable: true })
  async findUserBoatTaxes(@Args('userId', {type: () => Int}) userId: number): Promise<Tax[]> {
    return await this.userService.findAllBoatTax(userId);
  }
}
