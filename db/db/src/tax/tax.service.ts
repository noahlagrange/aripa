import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tax } from './tax.entity';

@Injectable()
export class TaxService {
  constructor(
    @InjectRepository(Tax) private TaxRepository: Repository<Tax>,
  ) {}

  async findAll(): Promise<Tax[]> {
    return this.TaxRepository.find();
  }

  async createTax(price: number, boatId: number, date: string): Promise<Tax> {
    const Tax = this.TaxRepository.create({ price, boatId, date });
    return this.TaxRepository.save(Tax);
  }

  async findTaxByBoatId(boatId: number): Promise<Tax[]> {
    return this.TaxRepository.find({ where: { boatId } });
  }

    async deleteTaxById(id: number): Promise<Tax | null> {
        const tax = await this.TaxRepository.findOne({ where: { id } });
        if (!tax) {
        return null;
        }
        return this.TaxRepository.remove(tax);
    }

    async updateTaxById(id: number, price: number, date: string): Promise<Tax | null> {
        const tax = await this.TaxRepository.findOne({ where: { id } });
        if (!tax) {
        return null;
        }
        tax.price = price;
        tax.date = date;
        return this.TaxRepository.save(tax);
    }

    
}
