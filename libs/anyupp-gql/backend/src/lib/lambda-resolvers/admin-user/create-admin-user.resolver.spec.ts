import { createAdminUser } from './create-admin-user.resolver';
import { defer, from, of } from 'rxjs';
import { AdminUserResolverDeps } from './utils';
import { catchError } from 'rxjs/operators';

// We use any-s to mock the system partially

const userName = 'GENERATED_USERNAME';

const goodDeps: AdminUserResolverDeps = {
  userPoolId: 'USER_POOL_ID',
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
  adminUserTableName: 'ADMIN_USER_TABLE',
  docClient: {
    put: jest.fn().mockReturnValue({
      promise: () => Promise.resolve({ Attributes: 'PUT RETURNED' }),
    }),
  } as any,
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
      (goodDeps.docClient.put as jest.Mock).mock.calls[0][0],
    ).toMatchSnapshot(
      {
        Item: {
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      },
      'CreateAdminUser parameters',
    );

    expect(res).toMatchSnapshot(
      {
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      },
      'RESULT',
    );
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
  const deps = listUserCaseDeps(
    Promise.reject(new Error('UNKNOWN LISTUSERS ERROR')),
  );

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
    next: res => {
      expect(res).toMatchSnapshot({
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
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
    Promise.reject(new Error('UNKNOWN ADMINCREATEUSER ERROR')),
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
    next: res => {
      expect(res).toMatchSnapshot({
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
      done();
    },
  });
});

const CrudsdkCreateUserCaseDeps = (
  result: Promise<unknown>,
): AdminUserResolverDeps => ({
  ...goodDeps,
  docClient: {
    ...goodDeps.docClient,
    put: jest.fn().mockReturnValue({ promise: () => result }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any,
});

test('Handle crudSdk.CreateAdminUser error', done => {
  const deps = CrudsdkCreateUserCaseDeps(Promise.reject('dynamodb PUT ERROR'));

  createGoodResolverCall(deps).subscribe({
    error: err => {
      expect(err).toMatchSnapshot();
      done();
    },
  });
});
