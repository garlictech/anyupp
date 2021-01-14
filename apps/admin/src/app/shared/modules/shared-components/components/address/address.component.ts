import { IAddress } from '../../../../interfaces';

import { Component, Input } from '@angular/core';

@Component({
  selector: 'bgap-address',
  templateUrl: './address.component.html'
})
export class AddressComponent {
  @Input() address: IAddress;
}
