import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Unit } from '@bgap/domain';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent {
  @Input() contact?: Unit;
}
