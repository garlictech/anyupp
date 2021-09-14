import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/main/main.dart';
import 'package:fa_prev/shared/widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_staggered_animations/flutter_staggered_animations.dart';

import 'package:fa_prev/modules/orders/orders.dart';

class OrderStatusScreen extends StatefulWidget {
  final GeoUnit unit;

  const OrderStatusScreen({
    required this.unit,
  });

  @override
  _OrderStatusScreenState createState() => _OrderStatusScreenState();
}

class _OrderStatusScreenState extends State<OrderStatusScreen> {
  OrderNotificationService _orderNotificationService = getIt<OrderNotificationService>();

  @override
  void initState() {
    super.initState();
    getIt<OrderBloc>().add(StartGetOrderListSubscription(widget.unit.chainId, widget.unit.id!));
  }

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<OrderBloc, BaseOrderState>(builder: (context, state) {
      // print('***** OrderScreen.bloc.state=$state');
      if (state is NoOrdersLoaded) {
        return _noOrder();
      }

      if (state is OrdersLoadedState) {
        if (state.orders == null || (state.orders != null && state.orders!.isEmpty)) {
          return _noOrder();
        }
        _orderNotificationService.checkIfShowOrderStatusNotification(context, state.orders!);
        return _buildOrderList(state.orders!);
      } else if (state is OrderLoadError) {
        return CommonErrorWidget(
          error: state.message!,
          description: state.details,
        );
      }

      return CenterLoadingWidget();
    });
  }

  Widget _buildOrderList(List<Order> list) {
    return AnimationLimiter(
      child: ListView.builder(
        itemCount: list.length + 1,
        scrollDirection: Axis.vertical,
        physics: BouncingScrollPhysics(),
        itemBuilder: (context, position) {
          if (position < list.length) {
            return AnimationConfiguration.staggeredList(
              position: position,
              duration: const Duration(milliseconds: 375),
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
    );
  }

  Widget _noOrder() {
    return EmptyWidget(
      messageKey: 'orders.noActiveOrder',
      descriptionKey: 'orders.noActiveOrderDesc',
      buttonTextKey: 'orders.noActiveOrderButton',
      onTap: () => getIt<MainNavigationBloc>().add(
        DoMainNavigation(
          pageIndex: 0,
        ),
      ),
    );
    // return Column(
    //   mainAxisAlignment: MainAxisAlignment.center,
    //   crossAxisAlignment: CrossAxisAlignment.center,
    //   children: <Widget>[
    //     // Display cart icon
    //     Image.asset(
    //       'assets/images/no-items-in-cart-icon.png',
    //       width: 128.0,
    //       fit: BoxFit.fitWidth,
    //     ),
    //     SizedBox(
    //       height: 60.0,
    //     ),
    //     Center(

    //         // Display message to the user
    //         child: Text(
    //       trans('orders.noActiveOrder'),
    //       style: TextStyle(
    //         fontSize: 15.0,
    //       ),
    //     ))
    //   ],
    // );
  }
}
