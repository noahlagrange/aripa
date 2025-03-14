import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Boat } from '../boat/boat.entity';
import { BoatService } from 'src/boat/boat.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Boat) private boatRepository: Repository<Boat>,
    private boatService: BoatService,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find({ relations: ['boats'] }); 
  }


  async deleteUsers(id: number): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { id }, relations: ['boats'] });
    if (!user) {
      return null;
    }
    for (let i = 0; i < user.boats.length; i++) {
      await this.boatService.deleteBoatById(user.boats[i].id);
    }
    return this.userRepository.remove(user);
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id }, relations: ['boats'] });
  }
  
  async deleteById(id: number): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { id }, relations: ['boats'] });
    if (!user) {
      return null;
    }
    return this.userRepository.remove(user);
  }

  async addBoatToUser(userId: number, boatId: number): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['boats'] });
    const boat = await this.boatRepository.findOne({ where: { id: boatId } });

    if (!user || !boat) {
      return null;
    }

    if (!user.boats.some(b => b.id === boat.id)) {
      user.boats.push(boat);
      return this.userRepository.save(user);
    }

    return user; 
  }

  async removeBoatFromUser(userId: number, boatId: number): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['boats'] });
    if (!user) {
      return null;
    }

    const boatIndex = user.boats.findIndex(b => b.id === boatId);
    if (boatIndex !== -1) {
      user.boats.splice(boatIndex, 1);
      return this.userRepository.save(user);
    }

    return user;
  }

  async createUser(name: string, email: string, phone: string): Promise<User> {
    const user = this.userRepository.create({ name, email, phone });
    return this.userRepository.save(user);
  }

  async findByID(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async findAllBoatTax(userId: number): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['boats', 'boats.taxes'],
    });
  
    if (!user) {
      return null;
    }
  
    const taxes = user.boats.flatMap((boat) => boat.taxes);
    return taxes;
  }

  async updateUser(id: number, name: string, email: string, phone: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      return null;
    }
    user.name = name;
    user.email = email;
    user.phone = phone;
    return this.userRepository.save(user);
  }
}
