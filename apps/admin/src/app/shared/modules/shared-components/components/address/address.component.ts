import { IAddress } from 'src/app/shared/interfaces';

import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
})
export class AddressComponent {
  @Input() address: IAddress;
}
