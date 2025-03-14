import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AccountService } from './account.service';
import { Account } from './account.entity';

@Resolver(() => Account)
export class AccountResolver {
    constructor(private readonly accountService: AccountService) {}

    @Mutation(() => Account)
    async createAccount(
        @Args('name') name: string,
        @Args('password') password: string,
    ): Promise<Account> {
        return this.accountService.createAccount(name, password);
    }

    @Mutation(() => Boolean)
    async verifyAccount(
        @Args('name') name: string,
        @Args('password') password: string,
    ): Promise<boolean> {
        return this.accountService.verifyAccount(name, password);
    }
}
