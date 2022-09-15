/* eslint-disable @typescript-eslint/no-explicit-any */
import { Observable, of, throwError } from 'rxjs';
import { waiterCallerResolver } from './waiter-caller-resolver';

describe('waiterCallerResolver unit test', () => {
  const getMockDeps = (getUnitReturn: Observable<any>) => ({
    sdk: {
      GetUnit: jest.fn().mockReturnValue(getUnitReturn),
    },
    currentTimeISOString: () => 'CURRENT TIME',
    uuidGenerator: () => 'GENERATED UUID',
    axiosInstance: {
      request: jest
        .fn()
        .mockReturnValue(Promise.resolve('RKEEPER SUCCESS RESPONSE')),
    },
  });

  test('Missing unit ID', done => {
    waiterCallerResolver({} as any)({ input: { unitId: '' } } as any).subscribe(
      {
        next: () => {
          throw 'It must fail...';
        },
        error: err => {
          expect(err).toMatchSnapshot();
          done();
        },
      },
    );
  });

  test('GetUnit error', done => {
    const deps = getMockDeps(throwError('UNIT ERROR'));
    waiterCallerResolver(deps as any)({
      input: { unitId: 'UNITID' } as any,
    }).subscribe({
      next: () => {
        throw 'It must fail...';
      },
      error: err => {
        expect(err).toMatchSnapshot();
        done();
      },
    });
  });

  test('Unit not found', done => {
    const deps = getMockDeps(of(undefined));
    waiterCallerResolver(deps as any)({
      input: { unitId: 'UNITID' } as any,
    }).subscribe({
      next: () => {
        throw 'It must fail...';
      },
      error: err => {
        expect(err).toMatchSnapshot();
        done();
      },
    });
  });

  test('Unit cannot call waiter', done => {
    const deps = getMockDeps(of({ canCallWaiter: false }));
    waiterCallerResolver(deps as any)({
      input: { unitId: 'UNITID' } as any,
    }).subscribe({
      next: () => {
        throw 'It must fail...';
      },
      error: err => {
        expect(err).toMatchSnapshot();
        done();
      },
    });
  });

  test('Not supported POS', done => {
    const deps = getMockDeps(of({ canCallWaiter: true, pos: {} }));
    waiterCallerResolver(deps as any)({
      input: { unitId: 'UNITID' } as any,
    }).subscribe({
      next: () => {
        throw 'It must fail...';
      },
      error: err => {
        expect(err).toMatchSnapshot();
        done();
      },
    });
  });

  test('Missing waiter caller config ', done => {
    const deps = getMockDeps(
      of({
        canCallWaiter: true,
        pos: {
          rkeeper: {
            endpointUri: 'ENDKEEPERURI',
          },
        },
      }),
    );
    waiterCallerResolver(deps as any)({
      input: { unitId: 'UNITID' } as any,
    }).subscribe({
      next: () => {
        throw 'It must fail...';
      },
      error: err => {
        expect(err).toMatchSnapshot();
        done();
      },
    });
  });

  test('Missing rkeeper external ID', done => {
    const deps = getMockDeps(
      of({
        canCallWaiter: true,
        pos: {
          rkeeper: {
            endpointUri: 'ENDKEEPERURI',
            waiterOrderId: 'WAITER ORDER ID',
          },
        },
      }),
    );
    waiterCallerResolver(deps as any)({
      input: { unitId: 'UNITID' } as any,
    }).subscribe({
      next: () => {
        throw 'It must fail...';
      },
      error: err => {
        expect(err).toMatchSnapshot();
        done();
      },
    });
  });

  test('Send successfull waiter call', done => {
    const deps = getMockDeps(
      of({
        externalId: 'EXTERNALID',
        canCallWaiter: true,
        pos: {
          rkeeper: {
            endpointUri: 'ENDKEEPERURI',
            waiterOrderId: 'WAITER ORDER ID',
          },
        },
      }),
    );
    waiterCallerResolver(deps as any)({
      input: {
        unitId: 'UNITID',
        place: { table: '1', seat: '2' },
        guestLabel: 'GUEST LABEL',
      },
    }).subscribe({
      next: () => {
        expect(deps.axiosInstance.request.mock.calls).toMatchSnapshot(
          'AXIOS REQUEST CALLS',
        );
        done();
      },
      error: err => {
        expect(`Should not fail: ${err}`).toBeFalsy();
        done();
      },
    });
  });

  test('Send successfull waiter call', done => {
    const deps = getMockDeps(
      of({
        externalId: 'EXTERNALID',
        canCallWaiter: true,
        pos: {
          rkeeper: {
            endpointUri: 'ENDKEEPERURI',
            waiterOrderId: 'WAITER ORDER ID',
          },
        },
      }),
    );
    waiterCallerResolver(deps as any)({
      input: {
        unitId: 'UNITID',
        place: { table: '1', seat: '2' },
        guestLabel: 'GUEST LABEL',
      },
    }).subscribe({
      next: () => {
        expect(deps.axiosInstance.request.mock.calls).toMatchSnapshot(
          'AXIOS REQUEST CALLS',
        );
        done();
      },
      error: err => {
        expect(`Should not fail: ${err}`).toBeFalsy();
        done();
      },
    });
  });

  test('Rkeeper server error', done => {
    const deps = {
      ...getMockDeps(
        of({
          externalId: 'EXTERNALID',
          canCallWaiter: true,
          pos: {
            rkeeper: {
              endpointUri: 'ENDKEEPERURI',
              waiterOrderId: 'WAITER ORDER ID',
            },
          },
        }),
      ),

      axiosInstance: {
        request: jest.fn().mockImplementation(() => {
          throw 'SERVER ERROR';
        }),
      },
    };

    waiterCallerResolver(deps as any)({
      input: {
        unitId: 'UNITID',
        place: { table: '1', seat: '2' },
        guestLabel: 'GUEST LABEL',
      },
    }).subscribe({
      next: () => {
        expect('Must throw error').toBeFalsy();
        done();
      },
      error: err => {
        expect(err).toMatchSnapshot();
        done();
      },
    });
  });
});
