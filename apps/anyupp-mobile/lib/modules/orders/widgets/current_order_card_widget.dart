import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/core/theme/theme.dart';
import 'package:fa_prev/graphql/utils/graphql_coercers.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/screens.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/shared/nav.dart';
import 'package:fa_prev/shared/utils/format_utils.dart';
import 'package:flutter/material.dart';

class CurrentOrderCardWidget extends StatelessWidget {
  final Order order;
  final GeoUnit unit;

  const CurrentOrderCardWidget({
    required this.order,
    required this.unit,
  });

  static const Map<String, IconData> _ICONMAP = {
    'none': Icons.hourglass_bottom_outlined,
    'placed': Icons.assignment_turned_in,
    'processing': Icons.history_toggle_off_outlined,
    'ready': Icons.schedule_outlined,
    'served': Icons.check_circle_rounded,
    'rejected': Icons.delete_forever,
  };

  @override
  Widget build(BuildContext context) {
    var status = order.statusLog[order.statusLog.length - 1].status;
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
          child: Row(
            children: [
              // Icon
              Container(
                margin: EdgeInsets.only(
                  left: 16.0,
                  top: 18.0,
                  bottom: 18.0,
                ),
                width: 40.0,
                height: 40.0,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: order.archived ? theme.secondary16 : theme.secondary0,
                  border: order.archived
                      ? null
                      : Border.all(
                          color: theme.primary,
                          width: 2.0,
                        ),
                ),
                child: Center(
                  child: Icon(
                    _ICONMAP[status],
                    color: order.archived ? theme.secondary : theme.primary,
                  ),
                ),
              ),
              // Date and state text
              Container(
                margin: EdgeInsets.only(
                  left: 12.0,
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      order.archived
                          ? dateFormatter.format(
                              fromGraphQLAWSDateTimeToDartDateTime(
                                  order.createdAt!))
                          : dateWithDayFormatter.format(
                              fromGraphQLAWSDateTimeToDartDateTime(
                                  order.createdAt!)),
                      style: Fonts.satoshi(
                        fontSize: 16.0,
                        color: theme.secondary,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    Text(
                      trans(context, 'orders.infos.status.$status.title'),
                      style: Fonts.satoshi(
                        fontSize: 14.0,
                        color: theme.secondary,
                        fontWeight: FontWeight.w400,
                      ),
                    ),
                  ],
                ),
              ),
              // Price string
              Spacer(),
              Container(
                margin: EdgeInsets.only(
                  right: 16.0,
                ),
                child: Text(
                  formatCurrency(order.sumPriceShown.priceSum,
                      order.sumPriceShown.currency),
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
    );
  }
}
