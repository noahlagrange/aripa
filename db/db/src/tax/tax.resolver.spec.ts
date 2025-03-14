import { Test, TestingModule } from '@nestjs/testing';
import { TaxResolver } from './tax.resolver';

describe('TaxResolver', () => {
  let resolver: TaxResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaxResolver],
    }).compile();

    resolver = module.get<TaxResolver>(TaxResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
