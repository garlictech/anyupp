import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Allergen, Maybe } from '@bgap/domain';

import { ALLERGENS } from '../../../../shared/utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-allergens',
  templateUrl: './allergens.component.html',
  styleUrls: ['./allergens.component.scss'],
})
export class AllergensComponent {
  @Input() allergens?: Maybe<Allergen>[] | null;
  public allergenMap: Map<string, number>;

  constructor() {
    this.allergenMap = new Map(ALLERGENS.map(i => [i.id, i.idx]));
  }
}
