import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Availability, Maybe } from '@bgap/domain';
import { EVariantAvailabilityType } from '@bgap/shared/types';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-variant-availability-badge',
  templateUrl: './variant-availability-badge.component.html',
  styleUrls: ['./variant-availability-badge.component.scss'],
})
export class VariantAvailabilityBadgeComponent {
  @Input() availability?: Maybe<Availability>;
  @Input() currency = '';

  public EVariantAvailabilityType = EVariantAvailabilityType;
}
