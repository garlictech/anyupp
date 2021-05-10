import * as fp from 'lodash/fp';
import { Observable, of } from 'rxjs';
import { filter, map, shareReplay, switchMap } from 'rxjs/operators';

import { Pipe, PipeTransform } from '@angular/core';
import { productComponentSetsSelectors } from '@bgap/admin/shared/data-access/product-component-sets';
import { IProductComponentSet } from '@bgap/shared/types';
import { Store } from '@ngrx/store';

@Pipe({
  name: 'productComponentSetInfo',
})
export class ProductComponentSetInfoPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(private _store: Store<any>) {}

  transform(componentSetId: string): Observable<IProductComponentSet> {
    return of(componentSetId).pipe(
      filter(fp.negate(fp.isEmpty)),
      switchMap(id =>
        this._store.select(
          productComponentSetsSelectors.getProductComponentSetById(id),
        ),
      ),
      map(entity => entity),
      filter(fp.negate(fp.isEmpty)),
      map(componentSet => componentSet),
      shareReplay(),
    );
  }
}
