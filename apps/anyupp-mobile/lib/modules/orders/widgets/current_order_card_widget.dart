import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/core/theme/theme.dart';
import 'package:fa_prev/graphql/utils/graphql_coercers.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/orders/orders.dart';
import 'package:fa_prev/modules/screens.dart';
import 'package:fa_prev/modules/takeaway/takeaway.dart';
import 'package:fa_prev/shared/locale/locale.dart';
import 'package:fa_prev/shared/nav.dart';
import 'package:fa_prev/shared/utils/format_utils.dart';
import 'package:flutter/material.dart';
import 'package:fa_prev/graphql/generated/crud-api.dart';

class CurrentOrderCardWidget extends StatelessWidget {
  final Order order;
  final GeoUnit unit;

  const CurrentOrderCardWidget({
    required this.order,
    required this.unit,
  });

  static const Map<OrderStatus, IconData> _ICONMAP = {
    OrderStatus.none: Icons.hourglass_bottom_outlined,
    OrderStatus.placed: Icons.assignment_turned_in,
    OrderStatus.processing: Icons.history_toggle_off_outlined,
    OrderStatus.ready: Icons.schedule_outlined,
    OrderStatus.served: Icons.check,
    OrderStatus.rejected: Icons.close,
  };

  @override
  Widget build(BuildContext context) {
    var status = order.statusLog.last.status;
    return InkWell(
      onTap: () => Nav.to(
        OrderDetailsScreen(
          order: order,
          unit: unit,
        ),
        duration: const Duration(milliseconds: 200),
        animationType: NavAnim.SLIDEIN_DOWN,
      ),
      child: Container(
        margin: const EdgeInsets.only(
          bottom: 8.0,
          left: 16.0,
          right: 16.0,
        ),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(
            16.0,
          ),
          // border: Border.all(width: 1.5, color: theme.secondary16),
          color: theme.secondary0,
        ),
        child: Container(
          padding: EdgeInsets.all(0.0),
          child: IntrinsicHeight(
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Icon
                Container(
                  margin: EdgeInsets.only(
                    left: 16.0,
                    top: 26.0,
                    bottom: 18.0,
                  ),
                  width: 24.0,
                  height: 24.0,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: order.archived
                        ? status == OrderStatus.rejected
                            ? theme.secondary16
                            : theme.secondary40
                        : theme.secondary0,
                    border: order.archived
                        ? null
                        : Border.all(
                            color: theme.icon,
                            width: 2.0,
                          ),
                  ),
                  child: Center(
                    child: Icon(
                      order.orderPolicy == OrderPolicy.full
                          ? _ICONMAP[status]
                          : _ICONMAP[OrderStatus.served],
                      size: 16.0,
                      color: order.archived ? theme.secondary0 : theme.icon,
                    ),
                  ),
                ),
                // Date and state text
                Container(
                  margin: EdgeInsets.only(
                    left: 12.0,
                    top: 16.0,
                    bottom: 16.0,
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        order.archived
                            ? dateFormatter.format(order.createdAt)
                            : formatOrderDate(context, order.createdAt),
                        style: Fonts.satoshi(
                          fontSize: 16.0,
                          color: theme.secondary,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      Text(
                        trans(
                            context,
                            getOrderStatusTitleKeyByPolicy(
                                order.orderPolicy, status)),
                        style: Fonts.satoshi(
                          fontSize: 14.0,
                          color: theme.secondary,
                          fontWeight: FontWeight.w400,
                        ),
                      ),
                      if (!order.archived)
                        Column(
                          children: [
                            SizedBox(
                              height: 10.0,
                            ),
                            TakeawayStatusWidget(
                              servingMode:
                                  order.servingMode ?? ServingMode.inPlace,
                              padding: 4.0,
                            ),
                          ],
                        ),
                    ],
                  ),
                ),
                // Price string
                Spacer(),
                Container(
                  margin: EdgeInsets.only(
                    right: 16.0,
                    top: 28.0,
                  ),
                  // color: theme.secondary,
                  child: Text(
                    formatCurrency(
                      order.totalPrice,
                      order.sumPriceShown.currency,
                    ),
                    style: Fonts.satoshi(
                      fontSize: 16.0,
                      color: theme.secondary,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
