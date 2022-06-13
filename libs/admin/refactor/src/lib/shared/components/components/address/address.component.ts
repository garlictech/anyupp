import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Address } from '@bgap/domain';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-address',
  templateUrl: './address.component.html',
})
export class AddressComponent {
  @Input() address?: Address | null;
}
