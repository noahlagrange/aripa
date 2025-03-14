import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './account.entity';

@Injectable()
export class AccountService {
    constructor(
        @InjectRepository(Account)
        private readonly accountRepository: Repository<Account>,
    ) {}

    async createAccount(name: string, password: string): Promise<Account> {
        const account = this.accountRepository.create({ name, password });
        return this.accountRepository.save(account);
    }

    async verifyAccount(name: string, password: string): Promise<boolean> {
        const account = await this.accountRepository.findOne({ where: { name } });
        if (!account) return false;

        return account.password === password;
    }
}
