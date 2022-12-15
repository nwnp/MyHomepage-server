import { Test, TestingModule } from '@nestjs/testing';
import { TilsResolver } from './tils.resolver';

describe('TilsResolver', () => {
  let resolver: TilsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TilsResolver],
    }).compile();

    resolver = module.get<TilsResolver>(TilsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
