import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { currentStatus } from '@bgap/crud-gql/api';
import { Order, ServingMode } from '@bgap/domain';
import { EDashboardTicketListType } from '@bgap/shared/types';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-order-ticket-list-item',
  templateUrl: './order-ticket-list-item.component.html',
  styleUrls: ['./order-ticket-list-item.component.scss'],
})
export class OrderTicketListItemComponent {
  @Input() order!: Order;
  @Input() showMarkers?: boolean;
  @Input() selectedOrderUserId?: string;
  @Input() ticketListType?: EDashboardTicketListType;

  public currentStatus = currentStatus;
  public readyCount = 0;
  public EServingMode = ServingMode;

  /*
  ngOnChanges() {
    this.readyCount =
      this.ticketListType === EDashboardTicketListType.placed
        ? this.order.items.filter(
            (i: OrderItem): boolean =>
              currentStatus(i.statusLog) === OrderStatus.ready
          ).length
        : 0; // Show badhe only in placed list
  }
  */
}
