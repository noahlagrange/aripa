import { Module } from '@nestjs/common';
import { TaxService } from './tax.service';
import { TaxResolver } from './tax.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tax } from './tax.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tax])],
  providers: [TaxService, TaxResolver],
  exports: [TaxService],
})
export class TaxModule {}
