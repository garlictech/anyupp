import * as CrudApi from '@bgap/crud-gql/api';

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-address',
  templateUrl: './address.component.html',
})
export class AddressComponent {
  @Input() address?: CrudApi.Address | null;
}
