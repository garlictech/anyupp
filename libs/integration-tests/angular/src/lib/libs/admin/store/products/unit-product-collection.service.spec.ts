import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { entityConfig } from '@bgap/admin/shared/data-access/ngrx-data';
import { UnitProductCollectionService } from '@bgap/admin/store/products';
import {
  EntityCollectionServiceElementsFactory,
  EntityDataModule,
  EntityDispatcherFactory,
} from '@ngrx/data';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { testFixtures } from '../helper/fixtures';
import {
  addEntityToListTestLogic,
  emptyListTestLogic,
  filteredListTestLogic,
  getByKeyFromApiAndNotSaveToListTestLogic,
  getByKeyFromApiTestLogic,
  getByKeyFromCacheForceApiTestLogic,
  getByKeyFromCacheTestLogic,
  patchFilterTestLogic,
  updateEntityListTestLogic,
} from '../helper/generics';

describe('UnitProductCollectionService test', () => {
  let service: UnitProductCollectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        EffectsModule.forRoot([]),
        EntityDataModule.forRoot(entityConfig),
        HttpClientModule,
      ],
      providers: [
        EntityCollectionServiceElementsFactory,
        EntityDispatcherFactory,
      ],
    });

    // Mock constructor API call
    service = TestBed.inject(UnitProductCollectionService);
  });

  it('should start with empty entity list', done => {
    emptyListTestLogic(service, done);
  });

  it('should add entity to the list', done => {
    addEntityToListTestLogic(service, testFixtures[0], done);
  });

  it('should update entity to the list', done => {
    updateEntityListTestLogic(
      service,
      testFixtures[0],
      { ...testFixtures[0], name: 'Modded name' },
      done,
    );
  });

  it('should filter entity list', done => {
    filteredListTestLogic(
      service,
      testFixtures,
      {
        name: testFixtures[1].name,
      },
      done,
    );
  });

  it('should patch entity list filter', done => {
    patchFilterTestLogic(
      service,
      {
        id: 'id_filter',
      },
      {
        id: 'id_filter_mod',
        name: 'name_filter',
      },
      done,
    );
  });

  it('should get non-existing item from the API', done => {
    getByKeyFromApiTestLogic(service, testFixtures[0], done);
  });

  it('should get existing item from the cache', done => {
    getByKeyFromCacheTestLogic(service, testFixtures[0], done);
  });

  it('should get existing item from the API (force load)', done => {
    getByKeyFromCacheForceApiTestLogic(service, testFixtures[0], done);
  });

  it('should get non-existing item from the API and not save to entity list', done => {
    getByKeyFromApiAndNotSaveToListTestLogic(service, testFixtures[0], done);
  });
});
