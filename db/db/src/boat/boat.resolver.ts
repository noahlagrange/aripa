import { Resolver } from '@nestjs/graphql';
import { Boat } from './boat.entity';
import { BoatService } from './boat.service';
import { Args, Mutation, Query } from '@nestjs/graphql';
import { Int } from '@nestjs/graphql'; 
import { Tax } from 'src/tax/tax.entity';

@Resolver()
export class BoatResolver {
  constructor(private readonly boatService: BoatService) {}

  @Query(() => [Boat])
  boats() {
    return this.boatService.findAll();
  }

  @Mutation(() => Boat)
  async updateBoat(
    @Args('id', { type: () => Int }) id: number,
    @Args('name') name: string,
    @Args('type') type: string,
  ): Promise<Boat> {
    return this.boatService.updateBoat(id, name, type);
  }
  

  @Mutation(() => Boat)
  createBoat(
    @Args('name') name: string,
    @Args('type') type: string,
    @Args('owner', { type: () => Int }) owner: number, 
  ): Promise<Boat> {
    return this.boatService.createBoat(name, type, owner);
  }

  @Mutation(() => Boat)
  async addTaxToBoat(
    @Args('boatId', { type: () => Int }) boatId: number,
    @Args('taxId', { type: () => Int }) taxId: number
  ): Promise<Boat>  {
    return this.boatService.addTaxToBoat(boatId, taxId);
  }
  

  @Mutation(() => [Boat])
  findBoatByOwner(@Args('owner', { type: () => Int }) owner: number): Promise<Boat[]> {
    return this.boatService.findBoatByOwner(owner);
  }
    

  @Mutation(() => Boat)
  deleteBoatById(@Args('id', {type: () => Int}) id: number): Promise<Boat | null> {
    return this.boatService.deleteBoatById(id);
  }

  @Query(() => Boat, { nullable: true })
  Boat(@Args('id', {type: () => Int}) id: number): Promise<Boat | null> {
    return this.boatService.Boat(id);
  }

  @Query(() => [Tax, {nullable: true}])
  BoatTaxes(@Args('id', {type: () => Int}) id: number): Promise<Tax[]> {
    return this.boatService.getBoatTaxes(id);
  } 
}
