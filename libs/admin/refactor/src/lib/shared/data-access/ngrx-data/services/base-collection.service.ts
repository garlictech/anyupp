import * as R from 'ramda';
import { EMPTY, from, iif, of } from 'rxjs';
import { map, mergeMap, switchMap, take, tap, toArray } from 'rxjs/operators';

import { CrudSdkService } from '../../../../shared/data-access/sdk';
import {
  ApiConf,
  ApiListVariables,
  ENTITY_NAME,
} from '../../../../shared/types';
import { loggedUserSelectors } from '../../../../store/logged-user';
import { getAllPaginatedData } from '@bgap/gql-sdk';
import { filterNullish } from '@bgap/shared/utils';
import {
  EntityCollectionServiceBase,
  EntityCollectionServiceElementsFactory,
} from '@ngrx/data';

import { getApiConf } from '../fn/api-conf';

export class BaseCollectionService<
  ENTITY,
> extends EntityCollectionServiceBase<ENTITY> {
  public apiConf: ApiConf<ENTITY>;
  public filters: Record<string, unknown> = {};

  constructor(
    entityName: ENTITY_NAME,
    serviceElementsFactory: EntityCollectionServiceElementsFactory,
    crudSdk: CrudSdkService,
  ) {
    super(entityName, serviceElementsFactory);

    this.apiConf = getApiConf<ENTITY>(entityName, crudSdk);
  }

  override getAll() {
    console.error('Do not call getAll, use paginated query instead.');
    return EMPTY;
  }

  override getByKey(key: string) {
    console.error('Do not call getByKey directly, use getByKey$ instead.', key);
    return EMPTY;
  }

  override add<T>(entity: T) {
    console.error('Do not call add directly, use add$ instead.', entity);
    return EMPTY;
  }

  override update<T>(entity: T) {
    console.error('Do not call add directly, use add$ instead.', entity);
    return EMPTY;
  }

  // Get paginated data from the cache (missing data will be loaded from the DB)
  getCachedPaginatedData$(
    listVariables: ApiListVariables,
    saveDbToCache = true,
  ) {
    return of('load').pipe(
      tap(() => {
        this.setLoading(true);
      }),
      switchMap(() =>
        this.apiConf
          .listIds(listVariables, {
            fetchPolicy: 'no-cache',
          })
          .pipe(
            switchMap(result =>
              of({
                items: result?.items?.filter(i => !!i).map(i => i?.id) || [],
                nextToken: result?.nextToken,
              }),
            ),
            switchMap(result =>
              from(result.items).pipe(
                filterNullish(),
                mergeMap(id => this.getByKey$(id, false, false)),
                toArray(),
                tap(items => {
                  if (saveDbToCache) {
                    this.addManyToCache(items);
                  }
                }),
                switchMap(items =>
                  of({
                    items,
                    nextToken: result.nextToken,
                  }),
                ),
              ),
            ),
            tap(() => {
              this.setLoading(false);
            }),
            take(1),
          ),
      ),
    );
  }

  getAllCachedPaginatedData$(
    listVariables: ApiListVariables,
    saveDbToCache = true,
  ) {
    return of('load').pipe(
      tap(() => {
        this.setLoading(true);
      }),
      switchMap(() =>
        getAllPaginatedData(this.apiConf.listIds, {
          query: <Record<string, unknown>>listVariables,
          options: { fetchPolicy: 'no-cache' },
        }).pipe(
          switchMap(result =>
            of(result?.items?.filter(i => !!i).map(i => i?.id) || []),
          ),
          switchMap(items =>
            from(items).pipe(
              filterNullish(),
              mergeMap(id => this.getByKey$(id, false, false)),
              toArray(),
              tap(items => {
                if (saveDbToCache) {
                  this.addManyToCache(items);
                }
              }),
              switchMap(items =>
                of({
                  items,
                }),
              ),
            ),
          ),
          tap(() => {
            this.setLoading(false);
          }),
          take(1),
        ),
      ),
    );
  }

  getByKey$(key: string, saveDbToCache = true, forceLoad = false) {
    return this.keys$.pipe(
      take(1),
      map(items => R.find(R.equals(key))(<string[]>items)),
      switchMap(keyFound =>
        iif(
          () => !keyFound || forceLoad,
          // Load from DB
          of('fromAPI').pipe(
            switchMap(() =>
              this.apiConf.get(
                {
                  id: key,
                },
                {
                  fetchPolicy: 'no-cache',
                },
              ),
            ),
            filterNullish(),
            tap(item => {
              if (saveDbToCache) {
                this.addOneToCache(item);
              }
            }),
          ),
          // Load from chace
          this.entityMap$.pipe(
            switchMap(entityMap => of(<ENTITY>entityMap[key])),
          ),
        ),
      ),
      take(1),
    );
  }

  add$<T>(entity: T) {
    return of('add').pipe(
      switchMap(() =>
        this.apiConf.add({ input: entity }).pipe(
          switchMap(result => {
            if (result) {
              this.addOneToCache(result);
            }

            return of(result);
          }),
          take(1),
        ),
      ),
    );
  }

  update$<T>(entity: T) {
    return of('update').pipe(
      switchMap(() =>
        this.apiConf.update({ input: entity }).pipe(
          switchMap(result => {
            if (result) {
              this.updateOneInCache(result);
            }

            return of(result);
          }),
          take(1),
        ),
      ),
    );
  }

  // Override super method - override the whole filter object
  override setFilter(filters: Record<string, unknown>) {
    this.filters = filters;

    super.setFilter(this.filters);
  }

  // Patch filter parts
  patchFilter(filterPart: Record<string, unknown>) {
    this.setFilter({
      ...this.filters,
      ...filterPart,
    });
  }

  setCurrentLocalizedItemFilter(property: string, value: string) {
    this.store
      .select(loggedUserSelectors.getSelectedLanguage)
      .pipe(filterNullish(), take(1))
      .subscribe((lang: string) => {
        this.patchFilter({
          [property]: {
            [lang.substring(0, 2)]: value.toLocaleLowerCase(),
          },
        });
      });
  }
}
