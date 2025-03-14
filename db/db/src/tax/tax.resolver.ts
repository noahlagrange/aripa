import { Resolver } from '@nestjs/graphql';
import { Tax } from './tax.entity';
import { TaxService } from './tax.service';
import { Args, Mutation, Query } from '@nestjs/graphql';
import { Int } from '@nestjs/graphql';
@Resolver()
export class TaxResolver {
    constructor(private readonly taxService: TaxService) {}
    
    @Query(() => [Tax])
    taxes() {
        return this.taxService.findAll();
    }

    @Query(() => [Tax])
    taxesByBoatId(@Args('boatId', { type: () => Int }) boatId: number) {
        return this.taxService.findTaxByBoatId(boatId);
    }

    @Mutation(() => Tax)
    createTax(
        @Args('price', { type: () => Int }) price: number,
        @Args('boatId', { type: () => Int }) boatId: number,
        @Args('date') date: string,
    ): Promise<Tax> {
        return this.taxService.createTax(price, boatId, date);
    }

    @Mutation(() => Tax)
    deleteTaxById(@Args('id', { type: () => Int }) id: number): Promise<Tax | null> {
        return this.taxService.deleteTaxById(id);
    }

    @Mutation(() => Tax)
    updateTaxById(
        @Args('id', { type: () => Int }) id: number,
        @Args('price', {type: () => Int}) price: number,
        @Args('date') date: string,
    ): Promise<Tax | null> {
        return this.taxService.updateTaxById(id, price, date);
    }
}
