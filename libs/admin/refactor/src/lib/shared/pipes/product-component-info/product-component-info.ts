import * as fp from 'lodash/fp';
import { Observable, of } from 'rxjs';
import { filter, map, shareReplay, switchMap } from 'rxjs/operators';

import { Pipe, PipeTransform } from '@angular/core';
import { ProductComponent } from '@bgap/domain';
import { Store } from '@ngrx/store';

import { productComponentsSelectors } from '../../../store/product-components';

@Pipe({
  name: 'productComponentInfo',
})
export class ProductComponentInfoPipe implements PipeTransform {
  constructor(private _store: Store) {}

  transform(componentId?: string | null): Observable<ProductComponent> {
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
