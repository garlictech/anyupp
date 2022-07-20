import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/main/main.dart';
import 'package:fa_prev/modules/orders/orders.dart';
import 'package:fa_prev/modules/orders/utils/order_afterpay_utils.dart';
import 'package:fa_prev/modules/screens.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/shared/utils/format_utils.dart';
import 'package:fa_prev/shared/utils/navigator.dart';
import 'package:fa_prev/shared/widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_staggered_animations/flutter_staggered_animations.dart';
import 'package:fa_prev/graphql/generated/crud-api.graphql.dart';

import '../../../graphql/generated/crud-api.graphql.dart';

class OrderStatusListWidget extends StatefulWidget {
  const OrderStatusListWidget();

  @override
  _OrderStatusListWidgetState createState() => _OrderStatusListWidgetState();
}

class _OrderStatusListWidgetState extends State<OrderStatusListWidget> {
  OrderNotificationService _orderNotificationService =
      getIt<OrderNotificationService>();

  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<OrderBloc, BaseOrderState>(
      builder: (context, state) {
        // log.d('OrderStatusListWidget().state=$state');
        if (state is NoOrdersLoaded) {
          return NoOrderWidget(orderPolicy: OrderPolicy.full);
        }

        if (state is OrdersLoadedState) {
          // log.d('***** OrderStatusListWidget.bloc.state=OrdersLoadedState, length=${state.orders?.length}');
          if (state.orders == null ||
              (state.orders != null && state.orders!.isEmpty)) {
            return NoOrderWidget(orderPolicy: OrderPolicy.full);
          }

          _orderNotificationService.checkIfShowOrderStatusNotification(
              context, state.orders!);

          // TODO AFTERPAY
          // if (widget.unit.orderPaymentPolicy == OrderPaymentPolicy.afterpay) {
          //   return Padding(
          //     padding: const EdgeInsets.all(16.0),
          //     child: OrderAfterPayWidget(
          //       unit: widget.unit,
          //       orders: state.orders!,
          //     ),
          //   );
          // }
          return OrderListWidget(
            list: state.orders!,
          );
        } else if (state is OrderLoadError) {
          return CommonErrorWidget(
            error: state.message!,
            description: state.details,
          );
        }

        return Container(
          margin: EdgeInsets.only(top: 48),
          child: CenterLoadingWidget(),
        );
      },
    );
  }
}

class OrderAfterPayWidget extends StatelessWidget {
  final GeoUnit unit;
  final List<Order> orders;
  late final Order aggregatedOrder;

  OrderAfterPayWidget({Key? key, required this.unit, required this.orders})
      : super(key: key) {
    aggregatedOrder = aggregateOrders(orders)!;
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: theme.secondary0.withOpacity(0.8),
        borderRadius: const BorderRadius.all(
          Radius.circular(8.0),
        ),
        boxShadow: [
          BoxShadow(
            color: theme.secondary16,
            offset: Offset(0.0, 1.0), //(x,y)
            blurRadius: 4.0,
          ),
        ],
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          // HEADER
          Container(
            decoration: BoxDecoration(
              color: theme.secondary0,
              borderRadius: const BorderRadius.only(
                topRight: Radius.circular(8.0),
                topLeft: Radius.circular(8.0),
              ),
            ),
            child: InkWell(
              onTap: () => Nav.to(
                OrderDetailsScreen(
                  order: aggregatedOrder,
                ),
              ),
              child: OrderAfterPayHeaderWidget(
                order: aggregatedOrder,
                unit: unit,
              ),
            ),
          ),
          Divider(
            color: theme.secondary64.withOpacity(0.3),
            height: 1.0,
          ),
          ListView.separated(
            shrinkWrap: true,
            itemCount: orders.length,
            physics: NeverScrollableScrollPhysics(),
            itemBuilder: (context, index) {
              return InkWell(
                onTap: () => Nav.to(
                  OrderDetailsScreen(
                    order: orders[index],
                  ),
                ),
                child: OrderAfterPayItemWidget(
                  unit: unit,
                  order: orders[index],
                ),
              );
            },
            separatorBuilder: (context, index) => Divider(
              color: theme.secondary64.withOpacity(0.3),
              height: 1.0,
            ),
          )
        ],
      ),
    );
  }
}

class OrderAfterPayItemWidget extends StatelessWidget {
  final GeoUnit unit;
  final Order order;

  const OrderAfterPayItemWidget(
      {Key? key, required this.unit, required this.order})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    var status = order.status;

    return Container(
      child: Row(
        mainAxisAlignment: MainAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.only(
              left: 32.0,
              right: 12.0,
              top: 16.0,
              bottom: 16.0,
            ),
            child: Icon(
              STATUS_ICON_MAP[status],
              size: 24.0,
              color: theme.icon,
            ),
          ),
          Baseline(
            baseline: 16.0,
            baselineType: TextBaseline.alphabetic,
            child: Text(
              formatOrderTime(order.createdAt),
              style: Fonts.satoshi(
                fontSize: 15.0,
                color: theme.secondary,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
          Spacer(),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16.0),
            child: Baseline(
              baseline: 21.0,
              baselineType: TextBaseline.alphabetic,
              child: Text(
                formatCurrency(order.totalPrice, order.sumPriceShown.currency),
                style: Fonts.satoshi(
                  fontSize: 13.0,
                  color: theme.secondary,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ),
          )
        ],
      ),
    );
  }
}

class OrderAfterPayHeaderWidget extends StatelessWidget {
  const OrderAfterPayHeaderWidget({
    Key? key,
    required this.order,
    required this.unit,
  }) : super(key: key);

  final Order order;
  final GeoUnit unit;

  @override
  Widget build(BuildContext context) {
    var status = order.status;

    return Container(
      child: Row(
        children: [
          Container(
            margin: EdgeInsets.only(
              left: 16.0,
              top: 26.0,
              bottom: 18.0,
              right: 16.0,
            ),
            child: Icon(
              STATUS_ICON_MAP[status],
              // size: 24.0,
              color: theme.icon,
            ),
          ),
          // Date and status text
          Column(
            mainAxisAlignment: MainAxisAlignment.start,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                formatOrderDate(context, order.createdAt),
                style: Fonts.satoshi(
                  fontSize: 16.0,
                  color: theme.secondary,
                  fontWeight: FontWeight.w700,
                ),
              ),
              Text(
                trans(context,
                    'orders.infos.status.${enumToString(status)!}.title'),
                style: Fonts.satoshi(
                  fontSize: 15.0,
                  color: theme.secondary,
                  fontWeight: FontWeight.w400,
                ),
              ),
            ],
          ),
          Spacer(),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16.0),
            child: Text(
              formatCurrency(order.totalPrice, order.sumPriceShown.currency),
              style: Fonts.satoshi(
                fontSize: 16.0,
                color: theme.secondary,
                fontWeight: FontWeight.w700,
              ),
            ),
          )
        ],
      ),
    );
  }
}

class OrderListWidget extends StatelessWidget {
  final List<Order> list;

  const OrderListWidget({
    Key? key,
    required this.list,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          margin: EdgeInsets.only(
            top: 24.0,
            left: 16.0,
            bottom: 12.0,
          ),
          child: Text(
            trans(context, 'orders.titleCurrentOrder'),
            style: Fonts.satoshi(
              color: theme.secondary64,
              fontSize: 14.0,
              fontWeight: FontWeight.w400,
            ),
          ),
        ),
        AnimationLimiter(
          child: ListView.builder(
            shrinkWrap: true,
            itemCount: list.length,
            scrollDirection: Axis.vertical,
            physics: BouncingScrollPhysics(),
            itemBuilder: (context, position) {
              if (position < list.length) {
                return AnimationConfiguration.staggeredList(
                  position: position,
                  duration: const Duration(milliseconds: 200),
                  child: SlideAnimation(
                    verticalOffset: 50.0,
                    child: FadeInAnimation(
                      child: CurrentOrderCardWidget(
                        order: list[position],
                      ),
                    ),
                  ),
                );
                // } else if (_hasMoreItems) {
                //   return _buildLoadMoreItemsButton();
              } else {
                return Container();
              }
            },
          ),
        ),
      ],
    );
  }
}

class NoOrderWidget extends StatelessWidget {
  final OrderPolicy orderPolicy;
  final ThemeChainData theme = defaultTheme();
  NoOrderWidget({required this.orderPolicy});

  @override
  Widget build(BuildContext context) {
    return AnimationConfiguration.staggeredList(
      position: 0,
      duration: const Duration(milliseconds: 200),
      child: SlideAnimation(
        verticalOffset: 50.0,
        child: FadeInAnimation(
          child: Container(
            width: double.infinity,
            height: 150,
            margin: EdgeInsets.all(
              16.0,
            ),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.all(
                Radius.circular(16.0),
              ),
              boxShadow: [
                BoxShadow(
                  color: theme.secondary40,
                  offset: Offset(0.0, 1.0),
                  blurRadius: 2.0,
                ),
              ],
              color: theme.button,
            ),
            // child: Container(
            //   height: 136.0,
            // ),
            child: Stack(
              children: [
                Align(
                  alignment: Alignment.centerLeft,
                  child: ClipRect(
                    clipBehavior: Clip.hardEdge,
                    child: OverflowBox(
                      maxHeight: 450,
                      maxWidth: 550,
                      alignment: Alignment.centerRight,
                      child: Center(
                        child: Container(
                          decoration: BoxDecoration(
                            color: Colors.white.withOpacity(0.075),
                            shape: BoxShape.circle,
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
                Align(
                  alignment: Alignment.centerLeft,
                  child: ClipRect(
                    clipBehavior: Clip.hardEdge,
                    child: OverflowBox(
                      maxHeight: 450,
                      maxWidth: 750,
                      alignment: Alignment.centerRight,
                      child: Center(
                        child: Container(
                          decoration: BoxDecoration(
                            color: Colors.white.withOpacity(0.075),
                            shape: BoxShape.circle,
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
                Container(
                  margin: EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        trans(
                            context,
                            orderPolicy == OrderPolicy.full
                                ? 'orders.noActiveOrderFull'
                                : 'orders.noActiveOrderSimplified'), //'Nincs folyamatban lévő rendelésed',
                        style: Fonts.satoshi(
                          fontSize: 16.0,
                          color: theme.buttonText,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      Text(
                        trans(context,
                            'orders.noActiveOrderDesc'), // 'Rendelj néhány kattintással!',
                        style: Fonts.satoshi(
                          fontSize: 14.0,
                          color: theme.buttonText,
                          fontWeight: FontWeight.w400,
                        ),
                      ),
                      // SizedBox(
                      //   height: 24.0,
                      // ),
                      Spacer(),
                      ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(36.0),
                          ),
                          primary: theme.secondary0,
                        ),
                        onPressed: () => getIt<MainNavigationBloc>().add(
                          DoMainNavigation(
                            pageIndex: 0,
                          ),
                        ),
                        child: Text(
                          trans(context, 'orders.noActiveOrderButton'),
                          style: Fonts.satoshi(
                            fontSize: 14,
                            color: theme.secondary,
                            fontWeight: FontWeight.w400,
                          ),
                        ),
                      ),
                    ],
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
