import { Test, TestingModule } from '@nestjs/testing';
import { BoatResolver } from './boat.resolver';

describe('BoatResolver', () => {
  let resolver: BoatResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BoatResolver],
    }).compile();

    resolver = module.get<BoatResolver>(BoatResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
