import * as CrudApi from '@bgap/crud-gql/api';

const adminUserBase: CrudApi.CreateAdminUserInput = {
  name: 'John Doe',
  email: 'testuser+johndoe@anyupp.com',
  phone: '+36123456789',
};

const adminUser: CrudApi.AdminUser = {
  ...adminUserBase,
  id: 'admin_user_id',
  createdAt: '',
  updatedAt: '',
};

export const adminUserFixture = {
  adminUserBase,
  adminUser,
};
