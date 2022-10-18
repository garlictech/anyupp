import 'package:anyupp/providers/providers.dart';
import 'package:anyupp/utils/translater.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '/core/core.dart';
import '/core/theme/theme.dart';
import '/graphql/utils/graphql_coercers.dart';
import '/models.dart';
import '/modules/orders/orders.dart';
import '/modules/screens.dart';
import '/modules/takeaway/takeaway.dart';
import '/shared/nav.dart';
import '/shared/utils/format_utils.dart';
import 'package:flutter/material.dart';
import '/graphql/generated/crud-api.dart';

class CurrentOrderCardWidget extends ConsumerWidget with Translater {
  final Order order;
  // final Unit unit;

  const CurrentOrderCardWidget({
    required this.order,
    // required this.unit,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = ref.watch(themeProvider);
    AsyncValue productComponents =
        ref.watch(productComponentsOfAnOrderProvider(order));
    var status = order.status;

    return productComponents.when(
        loading: () => Container(),
        error: (err, stack) => Container(),
        data: (data) => InkWell(
              onTap: () => Nav.to(
                OrderDetailsScreen(order: order, productComponents: data
                    // unit: unit,
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
                              STATUS_ICON_MAP[status],
                              size: 16.0,
                              color: order.archived
                                  ? theme.secondary0
                                  : theme.icon,
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
                                _getCardTitle(context),
                                style: Fonts.satoshi(
                                  fontSize: 16.0,
                                  color: theme.secondary,
                                  fontWeight: FontWeight.w700,
                                ),
                              ),
                              Text(
                                t(
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
                                      servingMode: order.servingMode ??
                                          ServingMode.inPlace,
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
            ));
  }

  String _getCardTitle(BuildContext context) {
    if (order.orderPolicy == OrderPolicy.full && order.orderNum != null) {
      return '#${order.orderNum}';
    }

    return order.archived
        ? dateFormatter.format(order.createdAt)
        : formatOrderDate(context, order.createdAt);
  }
}
