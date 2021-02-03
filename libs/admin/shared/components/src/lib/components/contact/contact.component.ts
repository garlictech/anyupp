import { Component, Input } from '@angular/core';

import { IChain, IGroup, IUnit } from '@bgap/shared/types';

@Component({
  selector: 'bgap-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent {
  @Input() contact?: IChain | IGroup | IUnit;
}
