import * as fp from 'lodash/fp';
import { Observable, of } from 'rxjs';
import { filter, map, shareReplay, switchMap } from 'rxjs/operators';

import { Pipe, PipeTransform } from '@angular/core';
import { productComponentsSelectors } from '@bgap/admin/shared/data-access/product-components';
import * as CrudApi from '@bgap/crud-gql/api';
import { Store } from '@ngrx/store';

@Pipe({
  name: 'productComponentInfo',
})
export class ProductComponentInfoPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(private _store: Store) {}

  transform(componentId?: string | null): Observable<CrudApi.ProductComponent> {
    return of(componentId).pipe(
      filter(fp.negate(fp.isEmpty)),
      switchMap(id =>
        this._store.select(
          productComponentsSelectors.getProductComponentById(id),
        ),
      ),
      map(entity => entity),
      filter(fp.negate(fp.isEmpty)),
      map(component => component),
      shareReplay(),
    );
  }
}
