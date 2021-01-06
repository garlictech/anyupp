import { Test, TestingModule } from '@nestjs/testing';
import { GetAdminUserResolver } from './get-admin-user.resolver';

describe('GetAdminUserResolver', () => {
  let resolver: GetAdminUserResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GetAdminUserResolver],
    }).compile();

    resolver = module.get<GetAdminUserResolver>(GetAdminUserResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
