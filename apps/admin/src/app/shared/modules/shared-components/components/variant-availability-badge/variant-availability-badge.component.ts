import { Component, Input } from '@angular/core';

import { EVariantAvailabilityType } from '@bgap/shared/types/enums';
import { IAvailability } from '@bgap/shared/types/interfaces';

@Component({
  selector: 'bgap-variant-availability-badge',
  templateUrl: './variant-availability-badge.component.html',
  styleUrls: ['./variant-availability-badge.component.scss']
})
export class VariantAvailabilityBadgeComponent {
  @Input() availability: IAvailability;
  @Input() currency: string;

  public EVariantAvailabilityType = EVariantAvailabilityType;
}
