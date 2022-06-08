import { AdminUser, CreateAdminUserInput } from '@bgap/domain';

const adminUserBase: CreateAdminUserInput = {
  name: 'John Doe',
  email: 'testuser+johndoe@anyupp.com',
  phone: '+36123456789',
};

const adminUser: AdminUser = {
  ...adminUserBase,
  id: 'admin_user_id',
  createdAt: '',
  updatedAt: '',
};

export const adminUserFixture = {
  adminUserBase,
  adminUser,
};
