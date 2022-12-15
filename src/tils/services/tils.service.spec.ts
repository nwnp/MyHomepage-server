import { Test, TestingModule } from '@nestjs/testing';
import { TilsService } from './tils.service';

describe('TilsService', () => {
  let service: TilsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TilsService],
    }).compile();

    service = module.get<TilsService>(TilsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
