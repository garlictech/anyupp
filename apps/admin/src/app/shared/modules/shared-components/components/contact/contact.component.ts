import { Component, Input } from '@angular/core';

import { IChain, IGroup, IUnit } from '../../../../interfaces';

@Component({
  selector: 'bgap-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent {
  @Input() contact: IChain | IGroup | IUnit;
}
