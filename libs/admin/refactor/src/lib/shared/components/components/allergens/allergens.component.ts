import { ALLERGENS } from '../../../../shared/utils';
import * as CrudApi from '@bgap/crud-gql/api';

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-allergens',
  templateUrl: './allergens.component.html',
  styleUrls: ['./allergens.component.scss'],
})
export class AllergensComponent {
  @Input() allergens?: CrudApi.Maybe<CrudApi.Allergen>[] | null;
  public allergenMap: Map<string, number>;

  constructor() {
    this.allergenMap = new Map(ALLERGENS.map(i => [i.id, i.idx]));
  }
}
