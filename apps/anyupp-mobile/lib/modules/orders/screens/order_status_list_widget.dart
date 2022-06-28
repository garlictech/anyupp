import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/main/main.dart';
import 'package:fa_prev/modules/orders/orders.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/shared/widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_staggered_animations/flutter_staggered_animations.dart';

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
