import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/core/theme/theme.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/payment/simplepay/simplepay.dart';
import 'package:fa_prev/shared/auth.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/shared/utils/enum.dart';
import 'package:fa_prev/shared/nav.dart';
import 'package:fa_prev/shared/widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_staggered_animations/flutter_staggered_animations.dart';
import 'package:google_fonts/google_fonts.dart';

import 'package:fa_prev/modules/orders/orders.dart';

class OrderStatusScreen extends StatefulWidget {
  final GeoUnit unit;

  const OrderStatusScreen({Key key, @required this.unit}) : super(key: key);

  @override
  _OrderStatusScreenState createState() => _OrderStatusScreenState();
}

class _OrderStatusScreenState extends State<OrderStatusScreen> with AutomaticKeepAliveClientMixin<OrderStatusScreen> {
  OrderRepository _orderRepository = getIt<OrderRepository>();
  OrderNotificationService _orderNotificationService = getIt<OrderNotificationService>();

  @override
  bool get wantKeepAlive => true;

  @override
  void initState() {
    print('initState.StartGetOrderListSubscription()');
    getIt<OrderBloc>().add(StartGetOrderListSubscription(widget.unit.chainId, widget.unit.id));
    super.initState();
    // Future.delayed(Duration(seconds: 1)).then(
    //   (value) => getIt<OrderBloc>().add(
    //     StartGetOrderListSubscription(widget.unit.chainId, widget.unit.id),
    //   ),
    // );
  }

  @override
  void dispose() {
    getIt<OrderBloc>().add(StopOrderListSubscription());
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    super.build(context);
    return BlocBuilder<UnitSelectBloc, UnitSelectState>(
      builder: (context, state) {
        if (state is UnitSelected) {
          final GeoUnit unit = state.unit;
          return StreamBuilder<List<Order>>(
            stream: _orderRepository.getCurrentOrders(unit.chainId, unit.id),
            builder: (context, AsyncSnapshot<List<Order>> orderState) {
              // print('Screen.startListSubscription().state=$orderState');
              if (orderState.connectionState != ConnectionState.waiting || orderState.hasData) {
                if (orderState.data == null || orderState.data.isEmpty) {
                  return _noOrder();
                }

                // --- CHECK IF NEED TO SHOW SOME KIND OF NOTIFICATION
                _orderNotificationService.checkIfShowOrderStatusNotification(context, orderState.data);

                //return _buildList(unit, orderState.data);
                return _buildOrderList(orderState.data);
              } else if (orderState.hasError) {
                return CommonErrorWidget(
                  error: '',
                  description: '${orderState.error}',
                );
              }

              return CenterLoadingWidget();
            },
          );
        }

        return CenterLoadingWidget();
      },
    );
  }

  Widget buildListOld(GeoUnit unit, List<Order> list) {
    int cashOrderCount = 0;
    double cashOrderSum = 0.0;

    int onlineOrderCount = 0;
    double onlineOrderSum = 0.0;

    int waitingForCashPaymentCount = 0;
    double waitingForCashPaymentSum = 0.0;

    List<Order> cashOrders = [];
    List<Order> onlineOrders = [];
    list.forEach((order) {
      String status = order.statusLog[order.statusLog.length - 1].status;
      if (status == 'ready') {
        if (order.paymentMode.method == 'card' || order.paymentMode.method == 'cash') {
          // --- Payable
          if (order.paymentIntention == null) {
            cashOrderCount++;
            cashOrderSum += order.sumPriceShown.priceSum;
            cashOrders.add(order);
          } else {
            // Under payment, waiting for the waiter
            waitingForCashPaymentCount++;
            waitingForCashPaymentSum += order.sumPriceShown.priceSum;
            // orders.add(order);
          }
        } else if (order.paymentMode.method == 'inapp') {
          if (order.paymentIntention == null) {
            onlineOrderCount++;
            onlineOrderSum += order.sumPriceShown.priceSum;
            onlineOrders.add(order);
          }
        }
      }
    });

    return Column(
      children: [
        if (onlineOrderCount > 0)
          Container(
            padding: EdgeInsets.all(
              8.0,
            ),
            color: theme.background,
            // height: 100,
            child: Center(
              child: _buildStripePayButtonWidget(context, onlineOrders[0], onlineOrderSum),
              //_buildSimplePayButtonWidget(context, onlineOrders[0], onlineOrderSum),
            ),
          ),
        if (cashOrderCount > 0)
          Container(
            padding: EdgeInsets.all(
              8.0,
            ),
            color: theme.background,
            // height: 100,
            child: Center(
              child: _buildCallWaiterButtonWidget(
                  context, unit, cashOrderSum, cashOrders[0].sumPriceShown.currency, cashOrders),
            ),
          ),
        if (waitingForCashPaymentCount > 0)
          Container(
            padding: EdgeInsets.all(
              8.0,
            ),
            color: theme.background2,
            // height: 100,
            child: Center(
              child: _buildWaitingForPaymentInfo(context, waitingForCashPaymentCount, waitingForCashPaymentSum),
            ),
          ),
        Expanded(
          child: _buildOrderList(list),
        ),
      ],
    );
  }

  Widget _buildWaitingForPaymentInfo(BuildContext context, int count, double sum) {
    return Container(
      height: 50.0,
      child: Center(
        child: Text(
          trans('orders.waiting'),
          style: GoogleFonts.poppins(
            fontSize: 16,
            color: theme.text,
            fontWeight: FontWeight.w500,
          ),
        ),
      ),
    );
  }

  Widget _buildStripePayButtonWidget(BuildContext context, Order order, double sum) {
    return StreamBuilder<User>(
        stream: getIt<AuthRepository>().getAuthenticatedUserProfileStream(),
        builder: (BuildContext context, AsyncSnapshot<User> userSnapshot) {
          if (!userSnapshot.hasData) {
            return CenterLoadingWidget();
          }

          return BlocBuilder<UnitSelectBloc, UnitSelectState>(builder: (context, UnitSelectState unitState) {
            // final GeoUnit unit = (unitState is UnitSelected) ? unitState.unit : null;

            return Column(
              children: [
                SizedBox(
                  width: double.infinity,
                  height: 50.0,
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      primary: theme.indicator,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(0.0),
                        side: BorderSide(
                          color: theme.indicator,
                        ),
                      ),
                    ),
                    onPressed: null,
                    // onPressed: () => Nav.to(StripePaymentScreen(
                    //   chainId: unit.chainId,
                    //   unitId: unit.id,
                    //   userId: userSnapshot.data.id,
                    //   order: order,
                    //   sum: sum,
                    // )),
                    // onPressed: () => !(state is StripePaymentLoading)
                    //     ? getIt<StripePaymentBloc>().add(StartStripePaymentWithExistingCardEvent(unit.chainId, unit.id, userSnapshot.data.id))
                    //     : null,
                    child: Text(
                      '${trans('orders.stripepay')}',
                      style: GoogleFonts.poppins(
                        fontSize: 16,
                        color: theme.text2,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ),
                )
              ],
            );
          });
        });
  }

  // ignore: unused_element
  Widget _buildSimplePayButtonWidget(BuildContext context, Order order, double sum) {
    return BlocListener<SimplePayBloc, SimplePayState>(
      listener: (BuildContext context, SimplePayState state) {
        if (state is SimplePayWebStarted) {
          Nav.to(SimplePayScreen(url: state.url));
          // _openSimplePayUrlInBrowser(state.url);
        }

        // TODO: relocate this logic into the SimplePayBloc and use Events (cancel/timeout/etc) again
        if (state is SimplePayPaymentResultState) {
          // _closeInAppBrowser();

          switch (state.result.status) {
            case SimplePayPaymentStatus.CANCELLED:
            case SimplePayPaymentStatus.TIMEOUT:
              showErrorDialog(
                  context,
                  trans('payment.simplePayStatus.${stringFromEnum(state.result.status).toLowerCase()}.title'),
                  trans('payment.simplePayStatus.${stringFromEnum(state.result.status).toLowerCase()}.description',
                      [state.result.externalTransactionId]));
              break;
            case SimplePayPaymentStatus.FRAUD:
            case SimplePayPaymentStatus.NOTAUTHORIZED:
              // FAILED
              showErrorDialog(context, trans('payment.simplePayStatus.failed.title'),
                  trans('payment.simplePayStatus.failed.description', [state.result.externalTransactionId]));
              break;
            case SimplePayPaymentStatus.INFRAUD:
            case SimplePayPaymentStatus.AUTHORIZED:
            case SimplePayPaymentStatus.FINISHED:
              showSuccessDialog(context, trans('payment.simplePayStatus.finished.title'),
                  trans('payment.simplePayStatus.finished.description', [state.result.externalTransactionId]));
              break;
            case SimplePayPaymentStatus.INIT:
            case SimplePayPaymentStatus.INPAYMENT:
            case SimplePayPaymentStatus.REVERSED:
            case SimplePayPaymentStatus.REFUND:
              // DO NOTHING
              break;
          }
        }
      },
      child: BlocBuilder<UnitSelectBloc, UnitSelectState>(builder: (context, UnitSelectState unitState) {
        final GeoUnit unit = (unitState is UnitSelected) ? unitState.unit : null;
        return BlocBuilder<SimplePayBloc, SimplePayState>(builder: (context, SimplePayState state) {
          return Column(
            children: [
              SizedBox(
                width: double.infinity,
                height: 50.0,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(0.0),
                      side: BorderSide(
                        color: theme.indicator,
                      ),
                    ),
                    primary: theme.indicator,
                  ),
                  onPressed: () => !(state is SimplePayLoading)
                      ? getIt<SimplePayBloc>().add(StartSimplePayPayment(unit, order))
                      : null,
                  child: (state is SimplePayLoading || state is SimplePayWebStarted)
                      ? CenterLoadingWidget(
                          color: theme.highlight,
                          size: 20.0,
                        )
                      : Text(
                          '${trans('orders.simplepay')}',
                          style: GoogleFonts.poppins(
                            fontSize: 16,
                            color: theme.text2,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                ),
              )
            ],
          );
        });
      }),
    );
  }

  Widget _buildCallWaiterButtonWidget(
      BuildContext context, GeoUnit unit, double price, String currency, List<Order> orders) {
    return SizedBox(
      width: double.infinity,
      height: 50.0,
      child: BlocBuilder<PaymentBloc, BasePaymentState>(
        builder: (context, BasePaymentState state) {
          bool loading = state is PaymentInProgress;
          return ElevatedButton(
            style: ElevatedButton.styleFrom(
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(0.0),
                side: BorderSide(
                  color: theme.indicator,
                ),
              ),
              primary: theme.indicator,
            ),
            onPressed: () => loading ? null : getIt<PaymentBloc>().add(UserPaymentIntentionSignalAction(unit)),
            child: loading
                ? CenterLoadingWidget(
                    color: theme.highlight,
                    size: 20.0,
                    strokeWidth: 2.0,
                  )
                : Text(
                    //'${trans('PAY')} ${formatCurrency(price, currency)}',
                    trans('orders.pay'),
                    style: GoogleFonts.poppins(
                      fontSize: 16,
                      color: theme.text2,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
          );
        },
      ),
    );
  }

  Widget _buildOrderList(List<Order> list) {
    return AnimationLimiter(
      child: ListView.builder(
        itemCount: list.length,
        scrollDirection: Axis.vertical,
        physics: BouncingScrollPhysics(),
        itemBuilder: (context, position) {
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
        },
      ),
    );
  }

  Widget _noOrder() {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: <Widget>[
        // Display cart icon
        Image.asset(
          'assets/images/no-items-in-cart-icon.png',
          width: 128.0,
          fit: BoxFit.fitWidth,
        ),
        SizedBox(
          height: 60.0,
        ),
        Center(

            // Display message to the user
            child: Text(
          trans('orders.noActiveOrder'),
          style: TextStyle(
            fontSize: 15.0,
          ),
        ))
      ],
    );
  }
}
