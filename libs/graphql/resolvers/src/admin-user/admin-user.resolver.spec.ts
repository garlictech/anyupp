import { Test, TestingModule } from '@nestjs/testing';
import { AdminUserChangedResolver } from './admin-user-changed.resolver';

describe('AdminUserChangedResolver', () => {
  let resolver: AdminUserChangedResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminUserChangedResolver],
    }).compile();

    resolver = module.get<AdminUserChangedResolver>(AdminUserChangedResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
