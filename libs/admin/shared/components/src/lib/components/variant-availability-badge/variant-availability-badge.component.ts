import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import * as CrudApi from '@bgap/crud-gql/api';
import { EVariantAvailabilityType } from '@bgap/shared/types';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-variant-availability-badge',
  templateUrl: './variant-availability-badge.component.html',
  styleUrls: ['./variant-availability-badge.component.scss'],
})
export class VariantAvailabilityBadgeComponent {
  @Input() availability?: CrudApi.Maybe<CrudApi.Availability>;
  @Input() currency = '';

  public EVariantAvailabilityType = EVariantAvailabilityType;
}
