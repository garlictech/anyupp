import { IAddress } from '@bgap/shared/types';

import { Component, Input } from '@angular/core';

@Component({
  selector: 'bgap-address',
  templateUrl: './address.component.html'
})
export class AddressComponent {
  @Input() address: IAddress;
}
