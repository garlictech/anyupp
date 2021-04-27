import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { EVariantAvailabilityType } from '@bgap/shared/types';
import { IAvailability } from '@bgap/shared/types';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-variant-availability-badge',
  templateUrl: './variant-availability-badge.component.html',
  styleUrls: ['./variant-availability-badge.component.scss'],
})
export class VariantAvailabilityBadgeComponent {
  @Input() availability!: IAvailability;
  @Input() currency = '';

  public EVariantAvailabilityType = EVariantAvailabilityType;
}
