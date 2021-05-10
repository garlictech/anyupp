import { ALLERGENS } from '@bgap/admin/shared/utils';

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-allergens',
  templateUrl: './allergens.component.html',
  styleUrls: ['./allergens.component.scss'],
})
export class AllergensComponent {
  @Input() allergens!: string[];
  public allergenMap: Map<string, number>;

  constructor() {
    this.allergenMap = new Map(ALLERGENS.map(i => [i.id, i.idx]));
  }
}
