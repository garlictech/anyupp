import { EMPTY, of } from 'rxjs';
import { catchError, delay, switchMap, tap } from 'rxjs/operators';

/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import {
  ChainFormService,
  CrudSdkService,
  entityConfig,
} from '@bgap/admin/refactor';

import { chainFixture, testIdPrefix } from '@bgap/shared/fixtures';
import { UpsertResponse } from '@bgap/shared/types';
import {
  EntityCollectionServiceElementsFactory,
  EntityDataModule,
  EntityDispatcherFactory,
} from '@ngrx/data';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { signInToCognito, signOutFromCognito } from '../../shared/helper';
import { Chain } from 'libs/domain/src';

describe('ChainFormService', () => {
  const chainId = `${testIdPrefix}ADMIN_CHAIN_IT_CHAIN_ID_01`;

  let service: ChainFormService;
  let crudSdk: CrudSdkService;

  const cleanup = () =>
    crudSdk.sdk.DeleteChain({
      input: { id: chainId },
    });

  beforeAll(async () => {
    await signInToCognito();
  }, 60000);

  afterAll(async () => {
    await signOutFromCognito();
  }, 60000);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
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

    service = TestBed.inject(ChainFormService);
    crudSdk = TestBed.inject(CrudSdkService);
  }, 60000);

  it('createChainFormGroup should create form group', () => {
    expect(service.createChainFormGroup().value).toMatchSnapshot();
  });

  it('saveForm$ should call createChain$ method when id is not specified', done => {
    const createSpy = jest
      .spyOn(service, 'createChain$')
      .mockImplementationOnce(() => of({ data: 'ok', type: 'insert' }));

    service.saveForm$(chainFixture.chainBase).subscribe();

    expect(createSpy).toHaveBeenCalledWith(chainFixture.chainBase);

    done();
  }, 60000);

  it('saveForm$ should call updateChain$ method when id is specified', done => {
    const updateSpy = jest
      .spyOn(service, 'updateChain$')
      .mockImplementationOnce(() => of({ data: 'ok', type: 'update' }));

    service.saveForm$(chainFixture.chainBase, chainId).subscribe();

    expect(updateSpy).toHaveBeenCalledWith({
      ...chainFixture.chainBase,
      id: chainId,
    });

    done();
  }, 60000);

  it('createChain$ should create chain', done => {
    cleanup()
      .pipe(
        switchMap(() =>
          service.createChain$({
            ...chainFixture.chainBase,
            id: chainId,
          }),
        ),
        tap(saveResponse => {
          expect(saveResponse).toMatchSnapshot({
            data: {
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
            },
          });
        }),
        switchMap(() => cleanup()),
      )
      .subscribe(() => {
        done();
      });
  }, 60000);

  it('updateChain$ should update chain', done => {
    cleanup()
      .pipe(
        switchMap(() =>
          service.createChain$({
            ...chainFixture.chainBase,
            id: chainId,
          }),
        ),
        catchError(() => cleanup()),
        switchMap(saveResponse =>
          (<UpsertResponse<Chain>>saveResponse).data.id
            ? service.updateChain$({
                ...chainFixture.chainBase,
                id: chainId,
                name: 'MODDED NAME',
                phone: '12312321',
              })
            : EMPTY,
        ),
        catchError(() => cleanup()),
        tap(updateResponse => {
          expect(updateResponse).toMatchSnapshot({
            data: {
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
            },
          });
        }),
        switchMap(() => cleanup()),
      )
      .subscribe(() => {
        done();
      });
  }, 60000);

  it('updateChainImageStyles$ should update chain image style', done => {
    cleanup()
      .pipe(
        switchMap(() =>
          service.createChain$({
            ...chainFixture.chainBase,
            id: chainId,
          }),
        ),
        catchError(() => cleanup()),
        switchMap(() =>
          service.updateChainImageStyles$(chainId, 'header', 'header_image'),
        ),
        catchError(() => cleanup()),
        delay(2000),

        tap(updateResponse => {
          expect(updateResponse).toMatchSnapshot({
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          });
        }),
        switchMap(() =>
          service.updateChainImageStyles$(chainId, 'logo', 'logo_image'),
        ),
        catchError(() => cleanup()),
        tap(updateResponse => {
          expect(updateResponse).toMatchSnapshot({
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          });
        }),
        switchMap(() => cleanup()),
      )
      .subscribe(() => {
        done();
      });
  }, 60000);
});
