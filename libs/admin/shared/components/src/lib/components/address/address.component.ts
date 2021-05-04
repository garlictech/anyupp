import { IAddress } from '@bgap/shared/types';

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-address',
  templateUrl: './address.component.html',
})
export class AddressComponent {
  @Input() address?: IAddress;
}
