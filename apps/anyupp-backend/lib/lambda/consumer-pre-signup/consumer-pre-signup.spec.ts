import { defer, from } from 'rxjs';
import { Deps, handlerFn } from './consumer-pre-signup';

// We use any-s to mock the system partially

const goodDeps: Deps = {
  cognitoidentityserviceprovider: {
    listUsers: jest
      .fn()
      .mockReturnValue({ promise: () => Promise.resolve({ Users: [] }) }),

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any,
};

const createGoodHandlerCall = (deps: Deps) =>
  defer(() =>
    from(
      handlerFn({
        request: {
          userAttributes: {
            email: 'a@a.hu',
            phone_numner: '+123456789',
          },
        },
        userPoolId: 'USERPOOL_ID',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any)(deps),
    ),
  );

test('Handle the good case', done => {
  createGoodHandlerCall(goodDeps).subscribe(res => {
    expect(
      (goodDeps.cognitoidentityserviceprovider.listUsers as jest.Mock).mock
        .calls[0],
    ).toMatchSnapshot('parameters');

    expect(res).toMatchSnapshot('result');
    done();
  });
});

const listUserCaseDeps = (result: Promise<unknown>): Deps => ({
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

  createGoodHandlerCall(deps).subscribe({
    error: res => {
      expect(res).toMatchSnapshot();
      done();
    },
  });
});

test('Handle listUser returns bad data', done => {
  const deps = listUserCaseDeps(Promise.resolve(undefined));

  createGoodHandlerCall(deps).subscribe({
    error: res => {
      expect(res).toMatchSnapshot();
      done();
    },
  });
});

test('Handle multiple users found error', done => {
  const deps = listUserCaseDeps(Promise.resolve({ Users: [{}, {}] }));

  createGoodHandlerCall(deps).subscribe({
    error: res => {
      expect(res).toMatchSnapshot();
      done();
    },
  });
});

test('Handle user already exists error', done => {
  const deps = listUserCaseDeps(Promise.resolve({ Users: [{}] }));

  createGoodHandlerCall(deps).subscribe({
    error: res => {
      expect(res).toMatchSnapshot();
      done();
    },
  });
});
