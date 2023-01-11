import { Test, TestingModule } from '@nestjs/testing';
import { RankingsController } from './rankings.controller';

describe('RankingsController', () => {
  let controller: RankingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RankingsController],
    }).compile();

    controller = module.get<RankingsController>(RankingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
