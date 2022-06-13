import * as fp from 'lodash/fp';
import { Observable, of } from 'rxjs';
import { filter, map, shareReplay, switchMap } from 'rxjs/operators';

import { Pipe, PipeTransform } from '@angular/core';
import { ProductComponentSet } from '@bgap/domain';
import { Store } from '@ngrx/store';

import { productComponentSetsSelectors } from '../../../store/product-component-sets';

@Pipe({
  name: 'productComponentSetInfo',
})
export class ProductComponentSetInfoPipe implements PipeTransform {
  constructor(private _store: Store) {}

  transform(componentSetId: string): Observable<ProductComponentSet> {
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
