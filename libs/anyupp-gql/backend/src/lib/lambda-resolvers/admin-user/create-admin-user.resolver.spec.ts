import { createAdminUser } from './create-admin-user.resolver';
import { defer, from, Observable, of, throwError } from 'rxjs';
import { AdminUserResolverDeps } from './utils';

// We use any-s to mock teh system partially

const userName = 'GENERATED_USERNAME';

const goodDeps: AdminUserResolverDeps = {
  userPoolId: 'USER_POOL_ID',
  crudSdk: {
    CreateAdminUser: jest.fn().mockReturnValue(of(userName)),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any,
  cognitoidentityserviceprovider: {
    listUsers: jest
      .fn()
      .mockReturnValue({ promise: () => Promise.resolve({ Users: [] }) }),

    adminCreateUser: jest
      .fn()
      .mockReturnValue({ promise: () => Promise.resolve(true) }),

    adminDeleteUser: jest
      .fn()
      .mockReturnValue({ promise: () => Promise.resolve(true) }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any,
  userNameGenerator: jest.fn().mockReturnValue(userName),
};

const createGoodResolverCall = (deps: AdminUserResolverDeps) =>
  defer(() =>
    from(
      createAdminUser({
        input: { email: 'a@a.hu', name: 'Test Elek', phone: '+123456789' },
      })(deps),
    ),
  );

test('Handle the good case', done => {
  createGoodResolverCall(goodDeps).subscribe(res => {
    expect(
      (goodDeps.cognitoidentityserviceprovider.adminCreateUser as jest.Mock)
        .mock.calls[0],
    ).toMatchSnapshot('adminCreateUser parameters');

    expect(
      (goodDeps.cognitoidentityserviceprovider.listUsers as jest.Mock).mock
        .calls[0],
    ).toMatchSnapshot('listUsers parameters');

    expect(
      (goodDeps.crudSdk.CreateAdminUser as jest.Mock).mock.calls[0],
    ).toMatchSnapshot('CreateAdminUser parameters');

    expect(res).toMatchSnapshot();
    done();
  });
});

const listUserCaseDeps = (result: Promise<unknown>): AdminUserResolverDeps => ({
  ...goodDeps,
  cognitoidentityserviceprovider: {
    ...goodDeps.cognitoidentityserviceprovider,
    listUsers: jest.fn().mockReturnValue({
      promise: () => result,
    }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any,
});

test('Handle listUser unknown error', done => {
  const deps = listUserCaseDeps(Promise.reject('UNKNOWN LISTUSERS ERROR'));

  createGoodResolverCall(deps).subscribe({
    error: res => {
      expect(res).toMatchSnapshot();
      done();
    },
  });
});

test('Handle listUser returns bad data', done => {
  const deps = listUserCaseDeps(Promise.resolve(undefined));

  createGoodResolverCall(deps).subscribe({
    error: res => {
      expect(res).toMatchSnapshot();
      done();
    },
  });
});

test('Handle multiple users found error', done => {
  const deps = listUserCaseDeps(Promise.resolve({ Users: [{}, {}] }));

  createGoodResolverCall(deps).subscribe({
    error: res => {
      expect(res).toMatchSnapshot();
      done();
    },
  });
});

test('Handle user already exists error', done => {
  const deps = listUserCaseDeps(Promise.resolve({ Users: [{}] }));

  createGoodResolverCall(deps).subscribe({
    error: res => {
      expect(res).toMatchSnapshot();
      done();
    },
  });
});

const adminCreateUserCaseDeps = (
  result: Promise<unknown>,
): AdminUserResolverDeps => ({
  ...goodDeps,
  cognitoidentityserviceprovider: {
    ...goodDeps.cognitoidentityserviceprovider,
    adminCreateUser: jest.fn().mockReturnValue({
      promise: () => result,
    }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any,
});

test('Handle adminCreateUser unknown error', done => {
  const deps = adminCreateUserCaseDeps(
    Promise.reject('UNKNOWN ADMINCREATEUSER ERROR'),
  );

  createGoodResolverCall(deps).subscribe({
    error: res => {
      expect(res).toMatchSnapshot();
      done();
    },
  });
});

test('Handle adminCreateUser bad data', done => {
  const deps = adminCreateUserCaseDeps(Promise.resolve(undefined));

  createGoodResolverCall(deps).subscribe({
    error: res => {
      expect(res).toMatchSnapshot();
      done();
    },
  });
});

const CrudsdkCreateUserCaseDeps = (
  result: Observable<unknown>,
): AdminUserResolverDeps => ({
  ...goodDeps,
  crudSdk: {
    ...goodDeps.crudSdk,
    CreateAdminUser: jest.fn().mockReturnValue(result),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any,
});

test('Handle crudSdk.CreateAdminUser error', done => {
  const deps = CrudsdkCreateUserCaseDeps(
    throwError('crudSdk.CreateAdminUser ERROR'),
  );

  createGoodResolverCall(deps).subscribe({
    error: res => {
      expect(
        (goodDeps.cognitoidentityserviceprovider.adminDeleteUser as jest.Mock)
          .mock.calls[0],
      ).toMatchSnapshot('adminDeleteUser parameters');

      expect(res).toMatchSnapshot('result');
      done();
    },
  });
});
