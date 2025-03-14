import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoatService } from './boat.service';
import { BoatResolver } from './boat.resolver';
import { Boat } from './boat.entity';
import { Tax } from '../tax/tax.entity';
import { TaxModule } from 'src/tax/tax.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Boat, Tax]),
  TaxModule
  ],
  providers: [BoatService, BoatResolver],
  exports: [BoatService],
})
export class BoatModule {}
