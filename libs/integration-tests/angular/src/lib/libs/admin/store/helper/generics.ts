/* eslint-disable @typescript-eslint/no-explicit-any */

import { of, range } from 'rxjs';
import { delay, last, switchMap, take, tap } from 'rxjs/operators';

export const emptyListTestLogic = (service: any, done: jest.DoneCallback) => {
  service.entities$
    .pipe(
      take(1),
      tap(items => {
        // The initial list is empty
        expect(items).toEqual([]);
      }),
    )
    .subscribe(() => {
      done();
    });
};

export const filteredListTestLogic = (
  service: any,
  dataFixtures: any[],
  filter: any,
  done: jest.DoneCallback,
) => {
  const sdkSpy = jest.spyOn(service.apiConf, 'add');

  range(0, dataFixtures.length)
    .pipe(
      tap(idx => {
        sdkSpy.mockImplementation(
          jest.fn().mockReturnValue(of(dataFixtures[idx])),
        );
        service.setFilter(filter);
      }),
      switchMap(idx => service.add$(dataFixtures[idx])),
      last(),
      switchMap(() => service.entities$),
      take(1),
      tap(items => {
        // Full list
        expect(items).toMatchSnapshot();
      }),
      switchMap(() => service.filteredEntities$),
      take(1),
      tap(items => {
        // Filtered list
        expect(items).toMatchSnapshot();
      }),
    )
    .subscribe(() => {
      done();
    });
};

export const addEntityToListTestLogic = (
  service: any,
  dataFixture: any,
  done: jest.DoneCallback,
) => {
  const sdkSpy = jest
    .spyOn(service.apiConf, 'add')
    .mockImplementation(jest.fn().mockReturnValue(of(dataFixture)));

  service
    .add$(dataFixture)
    .pipe(
      tap(() => {
        // "Add" method has been called
        expect((sdkSpy.mock.calls[0][0] as any).input).toMatchSnapshot();
      }),
      switchMap(() => service.entities$),
      take(1),
      tap(items => {
        // The list has been updated
        expect(items).toMatchSnapshot();
      }),
    )
    .subscribe(() => {
      done();
    });
};

export const updateEntityListTestLogic = (
  service: any,
  dataFixture: any,
  updateFixture: any,
  done: jest.DoneCallback,
) => {
  const sdkCreateSpy = jest
    .spyOn(service.apiConf, 'add')
    .mockImplementation(jest.fn().mockReturnValue(of(dataFixture)));

  const sdkUpdateSpy = jest
    .spyOn(service.apiConf, 'update')
    .mockImplementation(jest.fn().mockReturnValue(of(updateFixture)));

  service
    .add$(dataFixture)
    .pipe(
      tap(() => {
        // "Add" method has been called
        expect((sdkCreateSpy.mock.calls[0][0] as any).input).toMatchSnapshot();
      }),
      switchMap(() => service.update$(updateFixture)),
      tap(() => {
        // "Update" method has been called
        expect((sdkUpdateSpy.mock.calls[0][0] as any).input).toMatchSnapshot();
      }),
      switchMap(() => service.entities$),
      take(1),
      tap(items => {
        // The list has been updated
        expect(items).toMatchSnapshot();
      }),
    )
    .subscribe(() => {
      done();
    });
};

export const patchFilterTestLogic = (
  service: any,
  initialFilter: Record<string, unknown>,
  newFilter: Record<string, unknown>,
  done: jest.DoneCallback,
) => {
  of('test')
    .pipe(
      tap(() => {
        // Initial filter
        service.setFilter(initialFilter);
      }),
      switchMap(() => service.filter$),
      take(1),
      tap(filters => {
        // Filter has been updated
        expect(filters).toMatchSnapshot();
        service.patchFilter(newFilter);
      }),
      switchMap(() => service.filter$),
      take(1),
      tap(filters => {
        // Filter has been updated
        expect(filters).toMatchSnapshot();
      }),
    )
    .subscribe(() => {
      done();
    });
};

export const getByKeyFromApiTestLogic = (
  service: any,
  dataFixture: any,
  done: jest.DoneCallback,
) => {
  const sdkSpy = jest
    .spyOn(service.apiConf, 'get')
    .mockImplementation(jest.fn().mockReturnValue(of(dataFixture)));

  service
    .getByKey$(dataFixture.id)
    .pipe(
      switchMap(() => service.entities$),
      take(1),
      tap(items => {
        // The entity list is empty
        expect(items).toMatchSnapshot();
      }),
      tap(() => {
        // "Get" method has been called
        expect((sdkSpy.mock.calls[0][0] as any).id).toMatchSnapshot();
      }),
      switchMap(() => service.entities$),
      take(1),
      tap(items => {
        // New item stored in the entity list
        expect(items).toMatchSnapshot();
      }),
    )
    .subscribe(() => {
      done();
    });
};

export const getByKeyFromCacheTestLogic = (
  service: any,
  dataFixture: any,
  done: jest.DoneCallback,
) => {
  jest
    .spyOn(service.apiConf, 'add')
    .mockImplementation(jest.fn().mockReturnValue(of(dataFixture)));

  const sdkGetSpy = jest
    .spyOn(service.apiConf, 'get')
    .mockImplementation(jest.fn().mockReturnValue(of(dataFixture)));

  service.entities$
    .pipe(
      take(1),
      tap(items => {
        // The entity list is empty
        expect(items).toMatchSnapshot();
      }),
      switchMap(() => service.add$(dataFixture)),
      tap(items => {
        // The new item has been added
        expect(items).toMatchSnapshot();
      }),
      delay(2000),
      switchMap(() => service.getByKey$(dataFixture.id)),
      tap(item => {
        // GET query has not been called
        expect(sdkGetSpy).not.toHaveBeenCalled();

        // Got the item from the cache
        expect(item).toMatchSnapshot();
      }),
    )
    .subscribe(() => {
      done();
    });
};

export const getByKeyFromCacheForceApiTestLogic = (
  service: any,
  dataFixture: any,
  done: jest.DoneCallback,
) => {
  jest
    .spyOn(service.apiConf, 'add')
    .mockImplementation(jest.fn().mockReturnValue(of(dataFixture)));

  const sdkGetSpy = jest
    .spyOn(service.apiConf, 'get')
    .mockImplementation(jest.fn().mockReturnValue(of(dataFixture)));

  service.entities$
    .pipe(
      take(1),
      tap(items => {
        // The entity list is empty
        expect(items).toMatchSnapshot();
      }),
      switchMap(() => service.add$(dataFixture)),
      tap(items => {
        // The new item has been added
        expect(items).toMatchSnapshot();
      }),
      delay(2000),
      switchMap(() => service.getByKey$(dataFixture.id, true, true)),
      tap(item => {
        // "Get" method has been called
        expect((sdkGetSpy.mock.calls[0][0] as any).id).toMatchSnapshot();

        // Got the item from the cache
        expect(item).toMatchSnapshot();
      }),
    )
    .subscribe(() => {
      done();
    });
};

export const getByKeyFromApiAndNotSaveToListTestLogic = (
  service: any,
  dataFixture: any,
  done: jest.DoneCallback,
) => {
  jest
    .spyOn(service.apiConf, 'add')
    .mockImplementation(jest.fn().mockReturnValue(of(dataFixture)));

  const sdkGetSpy = jest
    .spyOn(service.apiConf, 'get')
    .mockImplementation(jest.fn().mockReturnValue(of(dataFixture)));

  service.entities$
    .pipe(
      take(1),
      tap(items => {
        // The entity list is empty
        expect(items).toMatchSnapshot();
      }),
      switchMap(() => service.getByKey$(dataFixture.id, false, true)),
      tap(item => {
        // "Get" method has been called
        expect((sdkGetSpy.mock.calls[0][0] as any).id).toMatchSnapshot();

        // Got the item from the cache
        expect(item).toMatchSnapshot();
      }),
      switchMap(() => service.entities$),
      take(1),
      tap(items => {
        // New item NOT stored in the entity list
        expect(items).toMatchSnapshot();
      }),
    )
    .subscribe(() => {
      done();
    });
};
