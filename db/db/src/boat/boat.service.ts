import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Boat } from './boat.entity';
import { Tax } from '../tax/tax.entity';

@Injectable()
export class BoatService {
  constructor(
    @InjectRepository(Boat) private BoatRepository: Repository<Boat>,
    @InjectRepository(Tax) private TaxRepository: Repository<Tax>,
  ) {}

  async findAll(): Promise<Boat[]> {
    return this.BoatRepository.find({relations: ['taxes'] });
  }

  async deleteBoatById(id: number): Promise<Boat | null> {
    const boat = await this.BoatRepository.findOne({ where: { id }, relations: ['taxes'] });
    if (!boat) {
      return null;
    }
    this.delteAllTax(id);
    return this.BoatRepository.remove(boat);
  }

  async findBoatByOwner(owner: number): Promise<Boat[]> {
    const boats = await this.BoatRepository.find({ where: { owner } , relations: ['taxes'] });
    return boats;
  }

  async createBoat(name: string, type: string, owner: number): Promise<Boat> {
    const Boat = this.BoatRepository.create({ name, type, owner });
    return this.BoatRepository.save(Boat);
  }

  async addTaxToBoat(boatId: number, taxId: number): Promise<Boat> {
    const boat = await this.BoatRepository.findOne({
      where: { id: boatId },
      relations: ['taxes'],
    });
    const tax = await this.TaxRepository.findOne({ where: { id: taxId } });
  
    if (!tax) {
      throw new Error('Tax not found');
    }
    if (!boat) {
      throw new Error('Boat not found');
    }
  
    if (boat.taxes.find(t => t.id === tax.id)) {
      throw new Error('Tax already added to the boat');
    }
  
    boat.taxes.push(tax);
  
    return this.BoatRepository.save(boat);
  }
  
  async Boat(id: number): Promise<Boat | null> {
    return this.BoatRepository.findOne({ where: { id }, relations: ['taxes']  });
  }

  async getBoatTaxes(boatId: number): Promise<Tax[]> {
    const boat = await this.BoatRepository.findOne({ where: { id: boatId }, relations: ['taxes'] });
    if (!boat) {
      throw new Error('Boat not found');
    }
    return boat.taxes;
  }

  async delteAllTax(boatId: number): Promise<Boat> {
    const boat = await this.BoatRepository.findOne({ where: { id: boatId }, relations: ['taxes'] });
    if (!boat) {
      throw new Error('Boat not found');
    }
    for (let tax of boat.taxes) {
      await this.TaxRepository.remove(tax);
    }
    boat.taxes = [];
    return this.BoatRepository.save(boat);
  }

  async updateBoat(id: number, name: string, type: string): Promise<Boat> {
    const boat = await this.BoatRepository.findOne({ where: { id }, relations: ['taxes'] });
    if (!boat) {
      throw new Error('Boat not found');
    }
    boat.name = name;
    boat.type = type;
    return this.BoatRepository.save(boat);
  }

}
