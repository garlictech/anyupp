import 'package:anyupp/ui/waiter_caller_button/waiter_caller_button.dart';

import '/core/core.dart';
import '/models.dart';
import '/modules/orders/orders.dart';
import '/shared/locale/locale.dart';
import '/shared/utils/format_utils.dart';
import '/shared/widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:pull_to_refresh/pull_to_refresh.dart';

import 'order_history_list_widget.dart';
import 'order_status_list_widget.dart';

class OrdersScreen extends StatefulWidget {
  const OrdersScreen({Key? key}) : super(key: key);

  @override
  State<OrdersScreen> createState() => _OrdersScreenState();
}

class _OrdersScreenState extends State<OrdersScreen> {
  bool _ordersLoaded = false;
  bool _orderHistoryLoaded = false;
  bool _hasErrors = false;
  String? _error;
  String? _errorDetails;
  RefreshController _refreshController =
      RefreshController(initialRefresh: false);
  Order? _aggregatedOrder;
  bool _showAfterPayButton = false;

  void _onRefresh() async {
    _initScreen();
    _refreshController.refreshCompleted();
  }

  void _initScreen() {
    getIt<OrderBloc>().add(StartGetOrderListSubscription());
    getIt<OrderHistoryBloc>().add(StartGetOrderHistoryListSubscription());
  }

  @override
  void initState() {
    super.initState();
    _initScreen();
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Scaffold(
        // The appBar head text
        // extendBodyBehindAppBar: true,
        extendBody: true,
        backgroundColor: theme.secondary12,
        // body: Stack(
        //   children: [
        //     SmartRefresher(
        //       enablePullDown: true,
        //       header: MaterialClassicHeader(),
        //       controller: _refreshController,
        //       onRefresh: _onRefresh,
        //       child: MultiBlocListener(
        //         listeners: [
        //           BlocListener<OrderBloc, BaseOrderState>(
        //             listener: (context, state) {
        //               if (state is NoOrdersLoaded) {
        //                 setState(() {
        //                   _aggregatedOrder = null;
        //                   _ordersLoaded = true;
        //                 });
        //               }
        //               if (state is OrdersLoadedState) {
        //                 _aggregatedOrder = state.orders?.isNotEmpty == true
        //                     ? aggregateOrders(state.orders!)
        //                     : null;
        //                 _showAfterPayButton =
        //                     _aggregatedOrder?.isAfterPayOrdersReadyToPay ??
        //                         false;
        //                 log.d(
        //                     'OrderScreen._showAfterPayButton=$_showAfterPayButton');
        //                 setState(() {
        //                   _ordersLoaded = true;
        //                 });
        //               }
        //               if (state is OrderLoadError) {
        //                 setState(() {
        //                   _showAfterPayButton = false;
        //                   _aggregatedOrder = null;
        //                   _hasErrors = true;
        //                   _error = state.message;
        //                   _errorDetails = state.details;
        //                 });
        //               }
        //             },
        //           ),
        //           BlocListener<OrderHistoryBloc, BaseOrderHistoryState>(
        //             listener: (context, state) {
        //               if (state is NoOrderHistoryLoaded ||
        //                   state is OrderHistoryLoadedState) {
        //                 setState(() {
        //                   _orderHistoryLoaded = true;
        //                 });
        //               }
        //               if (state is OrderLoadHistoryError) {
        //                 setState(() {
        //                   _hasErrors = true;
        //                   _error = state.message;
        //                   _errorDetails = state.details;
        //                 });
        //               }
        //             },
        //           ),
        //         ],
        //         child: _ordersLoaded && _orderHistoryLoaded
        //             ? BlocBuilder<UnitSelectBloc, UnitSelectState>(
        //                 builder: (context, state) {
        //                   if (state is UnitSelected) {
        //                     return SingleChildScrollView(
        //                       physics: BouncingScrollPhysics(),
        //                       child: Column(
        //                         crossAxisAlignment: CrossAxisAlignment.start,
        //                         children: [
        //                           OrderStatusListWidget(
        //                             unit: state.unit,
        //                           ),
        //                           OrderHistoryListWidget(
        //                             unit: state.unit,
        //                           ),
        //                         ],
        //                       ),
        //                     );
        //                   }
        //                   return CenterLoadingWidget();
        //                 },
        body: Stack(
          children: [
            SmartRefresher(
              enablePullDown: true,
              header: MaterialClassicHeader(),
              controller: _refreshController,
              onRefresh: _onRefresh,
              physics: BouncingScrollPhysics(),
              child: MultiBlocListener(
                listeners: [
                  BlocListener<OrderBloc, BaseOrderState>(
                    listener: (context, state) {
                      // log.e('OrdersScreen OrderBloc.state: $state');
                      if (state is NoOrdersLoaded ||
                          state is OrdersLoadedState) {
                        setState(() {
                          _ordersLoaded = true;
                        });
                      }
                      if (state is OrderLoadError) {
                        setState(() {
                          _hasErrors = true;
                          _error = state.message;
                          _errorDetails = state.details;
                        });
                      }
                    },
                  ),
                  BlocListener<OrderHistoryBloc, BaseOrderHistoryState>(
                    listener: (context, state) {
                      // log.e('OrdersScreen OrderHistoryBloc.state: $state');
                      if (state is NoOrderHistoryLoaded ||
                          state is OrderHistoryLoadedState) {
                        setState(() {
                          _orderHistoryLoaded = true;
                        });
                      }
                      if (state is OrderLoadHistoryError) {
                        setState(() {
                          _hasErrors = true;
                          _error = state.message;
                          _errorDetails = state.details;
                        });
                      }
                    },
                  ),
                ],
                child: _ordersLoaded && _orderHistoryLoaded
                    ? SingleChildScrollView(
                        physics: BouncingScrollPhysics(),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            OrderStatusListWidget(),
                            OrderHistoryListWidget(),
                          ],
                        ),
                      )
                    : _hasErrors
                        ? CommonErrorWidget(
                            error: _error!,
                            errorDetails: _errorDetails,
                          )
                        : _hasErrors
                            ? CommonErrorWidget(
                                error: _error!,
                                errorDetails: _errorDetails,
                              )
                            : CenterLoadingWidget(),
              ),
            ),
            if (_showAfterPayButton)
              Align(
                alignment: Alignment.bottomCenter,
                child: Container(
                  margin: const EdgeInsets.only(bottom: 16.0),
                  child: OrderPaymentButtonPanel(
                    order: _aggregatedOrder!,
                  ),
                ),
              ),
            if (true) WaiterCallerButton()
          ],
        ),
      ),
    );
  }
}

class OrderPaymentButtonPanel extends StatelessWidget {
  final Order order;

  const OrderPaymentButtonPanel({
    Key? key,
    required this.order,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    // bool afterPay = unit.orderPaymentPolicy == OrderPaymentPolicy.afterpay;
    // log.d('_buildPaymentButtonPanel().cart.orderPolicy=${cart.orderPolicy}');
    // log.d('_buildPaymentButtonPanel().cart.place.empty=$showQrCodeScan');
    return Container(
      height: 56.0,
      width: double.infinity,
      margin: EdgeInsets.symmetric(
        horizontal: 16.0,
      ),
      child: ElevatedButton(
        onPressed: () => _handlePaymentButtonPressed(order),
        style: ElevatedButton.styleFrom(
          primary: theme.button,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(40),
          ),
        ),
        child: Stack(
          fit: StackFit.expand,
          children: [
            Positioned.fill(
              child: Align(
                alignment: Alignment.center,
                child: Text(
                  '${trans(context, 'cart.pay')} (${formatCurrency(order.totalPrice, order.sumPriceShown.currency)})',
                  key: const Key('cart-totalprice-text'),
                  style: Fonts.satoshi(
                    fontSize: 16.0,
                    fontWeight: FontWeight.w700,
                    color: theme.buttonText,
                  ),
                ),
              ),
            ),
            Positioned.fill(
              child: Align(
                alignment: Alignment.centerRight,
                child: Icon(
                  Icons.arrow_forward,
                  color: theme.buttonText,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  _handlePaymentButtonPressed(Order order) async {
    log.d('_handlePaymentButtonPressed()');
    // TODO AFTERPAY
    // var place = await currentPlace;
    // Nav.to(
    //   SelectPaymentMethodScreen(
    //     // orderId: order.id,
    //     place: place,
    //     unit: unit,
    //   ),
    //   animationType: NavAnim.SLIDEIN_DOWN,
    // );
  }
}
