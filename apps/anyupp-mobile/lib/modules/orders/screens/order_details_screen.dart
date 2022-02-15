import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/graphql/generated/crud-api.dart';
import 'package:fa_prev/graphql/utils/graphql_coercers.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/orders/orders.dart';
import 'package:fa_prev/modules/rating_tipping/rating_tipping.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/shared/nav.dart';
import 'package:fa_prev/shared/utils/format_utils.dart';
import 'package:fa_prev/shared/utils/pdf_utils.dart';
import 'package:fa_prev/shared/utils/unit_utils.dart';
import 'package:fa_prev/shared/widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_svg/flutter_svg.dart';

class OrderDetailsScreen extends StatefulWidget {
  final Order order;
  final GeoUnit unit;

  const OrderDetailsScreen({Key? key, required this.order, required this.unit})
      : super(key: key);

  @override
  State<OrderDetailsScreen> createState() => _OrderDetailsScreenState(order);
}

class _OrderDetailsScreenState extends State<OrderDetailsScreen> {
  late Order _order;

  _OrderDetailsScreenState(Order order) {
    _order = order;
    print(
        '**** OrderDetails.constructor.order[${order.id}].hasRated=${order.hasRated}');
  }

  @override
  Widget build(BuildContext context) {
    setToolbarThemeV2(theme);

    return MultiBlocListener(
      listeners: [
        BlocListener<OrderRefreshBloc, OrderRefreshState>(
          listener: (context, state) {
            // print('******* OrderDetailsScreen().listener.state=$state');
            if (state is OrderRefreshed) {
              setState(() {
                _order = state.order;
              });
            }
          },
        ),
        BlocListener<RatingBloc, RatingState>(
          listener: (context, state) {
            // print('******* OrderDetailsScreen().listener.state=$state');
            if (state is RatingSuccess) {
              GeoUnit unit = currentUnit!;
              getIt<OrderBloc>()
                  .add(StartGetOrderListSubscription(unit.chainId, unit.id));
              // Nav.pop();
            }
          },
        ),
      ],
      child: Scaffold(
        // extendBodyBehindAppBar: true,
        appBar: AppBar(
          leading: Padding(
            padding: const EdgeInsets.only(
              top: 8.0,
              bottom: 8.0,
              left: 15.0,
            ),
            child: BackButtonWidget(
              color: theme.secondary,
              icon: Icons.arrow_back,
            ),
          ),
          centerTitle: true,
          title: Text(
            formatOrderDate(context, _order.createdAt),
            style: Fonts.satoshi(
              fontSize: 16.0,
              color: theme.secondary,
              fontWeight: FontWeight.w700,
            ),
          ),
          elevation: 3.0,
          shadowColor: theme.secondary0.withOpacity(0.3),
          iconTheme: IconThemeData(
            color: theme.secondary, //change your color here
          ),
          backgroundColor: theme.secondary0,
        ),
        body: Container(
          color: theme.secondary0,
          padding: EdgeInsets.only(top: 16.0),
          child: SingleChildScrollView(
            physics: BouncingScrollPhysics(),
            child: Column(
              children: [
                Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: OrderStatusTimelineWidget(
                    status: _order.statusLog[_order.statusLog.length - 1],
                  ),
                ),
                OrderDetailsInfoTextWidget(
                  order: _order,
                  unit: widget.unit,
                ),
                OrderDetailsRatingAndTipWidget(order: _order),
                OrderDetailsTipAndServingFeeWidget(
                  order: _order,
                  unit: widget.unit,
                ),
                Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: OrderDetailsPaymentInfoWidget(
                    order: _order,
                  ),
                ),
                SizedBox(
                  height: 48.0,
                ),
                OrderDetailsInfoTable(
                  order: _order,
                  unit: widget.unit,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class OrderDetailsServiceFeePriceWidget extends StatelessWidget {
  final Order order;
  final GeoUnit unit;

  const OrderDetailsServiceFeePriceWidget({
    Key? key,
    required this.order,
    required this.unit,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    if (order.serviceFee == null || (order.serviceFee?.netPrice ?? 0) == 0) {
      return Container();
    }

    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          trans(context, 'cart.serviceFee'),
          style: Fonts.satoshi(
            fontSize: 14.0,
            fontWeight: FontWeight.w400,
            color: theme.secondary,
          ),
        ),
        RichText(
          text: TextSpan(
            text: '1',
            style: Fonts.satoshi(
              color: theme.secondary,
              fontSize: 14,
              fontWeight: FontWeight.w400,
            ),
            children: <TextSpan>[
              TextSpan(
                text: ' x ',
                style: Fonts.satoshi(
                  color: theme.secondary40,
                  fontSize: 14,
                  fontWeight: FontWeight.w400,
                ),
              ),
              TextSpan(
                text: formatCurrency(
                    order.serviceFee?.netPrice ?? 0, unit.currency),
                style: Fonts.satoshi(
                  color: theme.secondary,
                  fontSize: 14,
                  fontWeight: FontWeight.w400,
                ),
              ),
            ],
          ),
        ),
      ],
    );

    // return Text(eq
    //   trans(context, 'orders.details.serviceFee',
    //       [unit.serviceFeePolicy?.percentage.toInt() ?? 0]),
    //   style: Fonts.satoshi(
    //     color: theme.secondary64,
    //     fontSize: 14.0,
    //   ),
    // );
  }
}

class OrderDetailsServiceFeeWidget extends StatelessWidget {
  final Order order;
  final GeoUnit unit;

  const OrderDetailsServiceFeeWidget({
    Key? key,
    required this.order,
    required this.unit,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    if (order.serviceFee == null || (order.serviceFee?.netPrice ?? 0) == 0) {
      return Container();
    }

    return Text(
      trans(context, 'orders.details.serviceFee',
          [unit.serviceFeePolicy?.percentage.toInt() ?? 0]),
      style: Fonts.satoshi(
        color: theme.secondary64,
        fontSize: 14.0,
      ),
    );
  }
}

class OrderDetailsTipAndServingFeeWidget extends StatelessWidget {
  final Order order;
  final GeoUnit unit;
  OrderDetailsTipAndServingFeeWidget(
      {Key? key, required this.order, required this.unit});

  @override
  Widget build(BuildContext context) {
    if (order.tip == null) {
      return Container();
    }

    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: 16.0,
        vertical: 72.0,
      ),
      width: double.infinity,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            trans(context, 'orders.details.tipDetails'),
            style: Fonts.satoshi(
              fontSize: 24.0,
              fontWeight: FontWeight.w700,
              color: theme.secondary,
            ),
          ),
          SizedBox(
            height: 20.0,
          ),
          Row(
            mainAxisAlignment: MainAxisAlignment.start,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Flexible(
                flex: 12,
                child: Row(
                  children: [
                    Container(
                      padding: EdgeInsets.only(right: 16.0),
                      child: Icon(
                        Icons.monetization_on,
                        color: theme.secondary,
                      ),
                    ),
                    Text(
                      trans(context, 'orders.tipAmount'),
                      style: Fonts.satoshi(
                        fontSize: 14,
                        color: theme.secondary,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ],
                ),
              ),
              Flexible(
                flex: 7,
                child: Text(
                  formatCurrency(order.tip?.value ?? 0, unit.currency),
                  style: Fonts.satoshi(
                    fontSize: 14,
                    color: theme.secondary64,
                    fontWeight: FontWeight.w400,
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class OrderDetailsRatingAndTipWidget extends StatelessWidget {
  final Order order;

  final GeoUnit _unit;

  OrderDetailsRatingAndTipWidget({Key? key, required this.order})
      : _unit = currentUnit!;

  @override
  Widget build(BuildContext context) {
    if (!shouldDisplayRating(order, _unit)) {
      return Container();
    }

    return Column(
      children: [
        if (_unit.ratingPolicies != null && order.hasRated != true)
          Container(
            height: 56.0,
            width: double.infinity,
            margin: EdgeInsets.symmetric(horizontal: 16.0),
            child: ElevatedButton(
              onPressed: () => Nav.to(RatingAndTippingScreen(
                orderId: order.id,
                ratingPolicy: _unit.ratingPolicies![0],
              )),
              style: ElevatedButton.styleFrom(
                primary: lighten(theme.button, 76),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(40),
                ),
                elevation: 0.0,
              ),
              child: Text(
                trans(context, 'orders.sendRatingButton'),
                style: Fonts.satoshi(
                  fontSize: 16.0,
                  fontWeight: FontWeight.w700,
                  color: theme.buttonText,
                ),
              ),
            ),
          ),
        if (_unit.tipPolicy != null &&
            _unit.tipPolicy?.isNotEmpty == true &&
            order.tip == null &&
            order.paymentMode.method == PaymentMethod.inapp &&
            order.transaction?.status == PaymentStatus.success)
          Container(
            height: 56.0,
            width: double.infinity,
            margin: EdgeInsets.only(
              left: 16.0,
              right: 16.0,
              top: 12.0,
            ),
            child: ElevatedButton(
              onPressed: () => Nav.to(RatingAndTippingScreen(
                orderId: order.id,
                tipPolicy: _unit.tipPolicy,
              )),
              style: ElevatedButton.styleFrom(
                primary: theme.button,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(40),
                ),
                elevation: 0.0,
              ),
              child: Text(
                trans(context, 'orders.sendTipButton'),
                style: Fonts.satoshi(
                  fontSize: 16.0,
                  fontWeight: FontWeight.w700,
                  color: theme.buttonText,
                ),
              ),
            ),
          )
      ],
    );
  }
}

class OrderDetailsPaymentInfoWidget extends StatelessWidget {
  final Order order;

  const OrderDetailsPaymentInfoWidget({Key? key, required this.order})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    IconData icon = Icons.payments_rounded;
    String date = '';
    if (order.paymentMode.method == PaymentMethod.inapp ||
        order.paymentMode.method == PaymentMethod.card) {
      icon = Icons.credit_card_outlined;
      // if (order.transaction?.createdAt != null) {
      //   date = dateTimeFormatter.format(fromGraphQLAWSDateTimeToDartDateTime(order.transaction!.createdAt!));
      // }
    }
    // print('orderdetauils.order.transaction?.createdAt=${order.transaction?.createdAt}');
    if (order.transaction?.createdAt != null) {
      date = dateTimeFormatter.format(
          fromGraphQLAWSDateTimeToDartDateTime(order.transaction!.createdAt!));
    }

    bool showButton = order.transaction?.receipt?.pdfData != null ||
        order.transaction?.invoice?.pdfUrl != null;
    bool isInvoice = order.transaction?.invoice?.pdfUrl != null;

    // showButton = true;
    // isInvoice = false;

    return Container(
      width: double.infinity,
      // padding: EdgeInsets.only(left: 16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            trans(context, 'orders.details.paymentDetails'),
            style: Fonts.satoshi(
              fontSize: 24.0,
              fontWeight: FontWeight.w700,
              color: theme.secondary,
            ),
          ),
          SizedBox(
            height: 20.0,
          ),
          Row(
            children: [
              Icon(
                icon,
                color: theme.secondary,
              ),
              SizedBox(
                width: 18.0,
              ),
              Expanded(
                  flex: 2,
                  child: Text(
                    trans(context,
                        'orders.paymentDetails.${enumToString(order.paymentMode.method)}'),
                    style: Fonts.satoshi(
                      color: theme.secondary,
                      fontWeight: FontWeight.w400,
                      fontSize: 14.0,
                    ),
                  )),
              SizedBox(
                width: 18,
              ),
              Expanded(
                flex: 1,
                child: Text(
                  date,
                  textAlign: TextAlign.end,
                  style: Fonts.satoshi(
                    color: theme.secondary64,
                    fontWeight: FontWeight.w400,
                    fontSize: 14.0,
                  ),
                ),
              ),
            ],
          ),
          // OPTIONAL BUTTON
          if (showButton)
            Container(
              margin: EdgeInsets.only(top: 32),
              width: double.infinity,
              height: 56.0,
              child: ElevatedButton(
                onPressed: () => isInvoice
                    ? Nav.to(PdfWebView(order.transaction!.invoice!.pdfUrl!))
                    : createAndOpenPdf(order.transaction!.receipt!.pdfData),
                style: ElevatedButton.styleFrom(
                  primary: theme.button,
                  // shadowColor: null,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(40),
                  ),
                ),
                child: Text(
                  trans(
                      context,
                      isInvoice
                          ? 'payment.paymentInfo.invoicing.downloadInvoice'
                          : 'payment.paymentInfo.invoicing.downloadReceipt'),
                  style: Fonts.satoshi(
                    fontSize: 16.0,
                    fontWeight: FontWeight.w700,
                    color: theme.buttonText,
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }
}

class OrderDetailsInfoTextWidget extends StatelessWidget {
  final Order order;
  final GeoUnit unit;

  const OrderDetailsInfoTextWidget(
      {Key? key, required this.order, required this.unit})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    bool addServiceFeeInfoRow = unit.serviceFeePolicy?.type != null &&
        unit.serviceFeePolicy?.type != ServiceFeeType.noFee &&
        unit.serviceFeePolicy?.percentage != null &&
        order.serviceFee != null;
    // bool isServiceFeeIncluded =
    //     unit.serviceFeePolicy?.type == ServiceFeeType.included;

    print(
        'OrderDetailsInfoTextWidget.addServiceFeeInfoRow=$addServiceFeeInfoRow');

    return Container(
      // color: theme.secondary12,
      width: double.infinity,
      child: Column(
        mainAxisAlignment: MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Title
          Container(
            padding: EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  trans(context, 'orders.details.orderDetails'),
                  style: Fonts.satoshi(
                    fontSize: 24.0,
                    fontWeight: FontWeight.w700,
                    color: theme.secondary,
                  ),
                ),
                SizedBox(
                  height: 16.0,
                ),
                // Order item's texts
                ListView.builder(
                  shrinkWrap: true,
                  primary: false,
                  itemCount: order.items.length,
                  physics: NeverScrollableScrollPhysics(),
                  itemBuilder: (context, index) {
                    return addServiceFeeInfoRow &&
                            index == order.items.length - 1
                        ? Column(
                            mainAxisAlignment: MainAxisAlignment.start,
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              OrderDetailsInfoTextItemWidget(
                                item: order.items[index],
                                unit: unit,
                              ),
                              Padding(
                                  padding: const EdgeInsets.only(top: 16.0),
                                  child: OrderDetailsServiceFeeWidget(
                                    order: order,
                                    unit: unit,
                                  )

                                  // child: isServiceFeeIncluded
                                  //     ? OrderDetailsServiceFeeWidget(
                                  //         order: order,
                                  //         unit: unit,
                                  //       )
                                  //     : OrderDetailsServiceFeePriceWidget(
                                  //         order: order,
                                  //         unit: unit,
                                  //       ),
                                  ),
                            ],
                          )
                        : Container(
                            padding: EdgeInsets.only(top: index > 0 ? 32 : 0),
                            child: OrderDetailsInfoTextItemWidget(
                              item: order.items[index],
                              unit: unit,
                            ),
                          );
                  },
                ),
              ],
            ),
          ),

          // Summary row
          Container(
            padding: EdgeInsets.only(
              top: 16.0,
              bottom: 16.0,
            ),
            child: Container(
              color: theme.secondary12,
              padding: EdgeInsets.only(
                top: 16.0,
                bottom: 16.0,
                left: 16.0,
                right: 16.0,
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    trans(context, 'orders.totalCost'),
                    style: Fonts.satoshi(
                      fontSize: 16.0,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                  Text(
                    formatCurrency(
                        order.totalPrice(unit.serviceFeePolicy?.type),
                        order.items[0].priceShown.currency),
                    style: Fonts.satoshi(
                      fontSize: 16.0,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class OrderDetailsInfoTextItemWidget extends StatelessWidget {
  final OrderItem item;
  final GeoUnit unit;

  const OrderDetailsInfoTextItemWidget(
      {Key? key, required this.item, required this.unit})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    var extraNames = _getExtraNames(context);

    return Column(
      mainAxisAlignment: MainAxisAlignment.start,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              getLocalizedText(context, item.productName),
              style: Fonts.satoshi(
                fontSize: 14.0,
                fontWeight: FontWeight.w400,
                color: theme.secondary,
              ),
            ),
            RichText(
              text: TextSpan(
                text: '${item.quantity}',
                style: Fonts.satoshi(
                  color: theme.secondary,
                  fontSize: 14,
                  fontWeight: FontWeight.w400,
                ),
                children: <TextSpan>[
                  TextSpan(
                    text: ' x ',
                    style: Fonts.satoshi(
                      color: theme.secondary40,
                      fontSize: 14,
                      fontWeight: FontWeight.w400,
                    ),
                  ),
                  TextSpan(
                    text: formatCurrency(item.getPrice(), unit.currency),
                    style: Fonts.satoshi(
                      color: theme.secondary,
                      fontSize: 14,
                      fontWeight: FontWeight.w400,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
        // Variant
        Text(
          "${getLocalizedText(context, item.variantName)}",
          style: Fonts.satoshi(
            color: theme.secondary64,
            fontWeight: FontWeight.w400,
            fontSize: 14,
          ),
        ),
        // Extras
        if (item.configSets != null)
          ListView.builder(
            primary: false,
            shrinkWrap: true,
            physics: NeverScrollableScrollPhysics(),
            itemCount: extraNames.length,
            itemBuilder: (context, index) {
              return Text(
                "+ ${extraNames[index]}",
                style: Fonts.satoshi(
                  color: theme.secondary64,
                  fontWeight: FontWeight.w400,
                  fontSize: 14,
                ),
              );
            },
          ),
      ],
    );
  }

  List<String> _getExtraNames(BuildContext context) {
    List<String> extraNames = [];
    if (item.selectedConfigMap != null) {
      item.selectedConfigMap!.forEach((key, value) {
        for (GeneratedProductConfigComponent generatedProductConfigComponent
            in value) {
          extraNames.add(
              getLocalizedText(context, generatedProductConfigComponent.name));
        }
      });
    }
    return extraNames;
  }
}

enum OrderStatusTimelineIconState {
  none,
  finished,
  processing,
  not_started,
  failed,
}

class OrderStatusTimelineData {
  final String? time;
  final OrderStatusTimelineIconState icon;
  final Color iconColor;
  final String message;
  final Color textColor;
  final Color? bottomLineColor;
  final Color circleBorderColor;
  final Color circleBackgroundColor;

  OrderStatusTimelineData({
    required this.icon,
    required this.message,
    required this.textColor,
    required this.iconColor,
    required this.circleBorderColor,
    required this.circleBackgroundColor,
    this.bottomLineColor,
    this.time,
  });
}

class OrderStatusTimelineWidget extends StatelessWidget {
  final StatusLog status;

  const OrderStatusTimelineWidget({Key? key, required this.status})
      : super(key: key);

  List<OrderStatusTimelineData> _calculateTimelineData(BuildContext context) {
    List<OrderStatusTimelineData> results = [];
    OrderStatus orderStatus = status.status;
    // print('_calculateTimelineData.state=$orderStatus');
    // orderStatus = OrderStatus.rejected;

    // Handle FAILED
    if (orderStatus == OrderStatus.rejected) {
      // 1. Order placed, success
      results.add(OrderStatusTimelineData(
        icon: OrderStatusTimelineIconState.finished,
        iconColor: theme.secondary0,
        message: trans(context, 'orders.infos.timeline.none.finished'),
        bottomLineColor: Color(0xFFE74C3C),
        textColor: theme.secondary64,
        circleBackgroundColor: theme.highlight,
        circleBorderColor: theme.highlight,
      ));
      // 2. Add rejected, failed
      results.add(OrderStatusTimelineData(
        icon: OrderStatusTimelineIconState.failed,
        message: trans(context, 'orders.infos.timeline.rejected.finished'),
        iconColor: theme.secondary0,
        textColor: theme.secondary,
        circleBackgroundColor: Color(0xFFE74C3C),
        circleBorderColor: Color(0xFFE74C3C),
      ));
      return results;
    }

    // Handle normal flow
    // Build default empty flow
    results.add(OrderStatusTimelineData(
      icon: OrderStatusTimelineIconState.finished,
      message: trans(context, 'orders.infos.timeline.none.finished'),
      iconColor: theme.secondary0,
      textColor: theme.secondary,
      bottomLineColor: theme.secondary12,
      circleBackgroundColor: theme.highlight,
      circleBorderColor: theme.highlight,
    ));
    results.add(OrderStatusTimelineData(
      icon: OrderStatusTimelineIconState.not_started,
      message: trans(context, 'orders.infos.timeline.placed.waiting'),
      textColor: theme.secondary64,
      iconColor: theme.secondary0,
      bottomLineColor: theme.secondary12,
      circleBackgroundColor: theme.secondary0,
      circleBorderColor: theme.secondary12,
    ));
    results.add(OrderStatusTimelineData(
      icon: OrderStatusTimelineIconState.not_started,
      message: trans(context, 'orders.infos.timeline.processing.waiting'),
      textColor: theme.secondary64,
      iconColor: theme.secondary0,
      bottomLineColor: theme.secondary12,
      circleBackgroundColor: theme.secondary0,
      circleBorderColor: theme.secondary12,
    ));
    results.add(OrderStatusTimelineData(
      icon: OrderStatusTimelineIconState.not_started,
      message: trans(context, 'orders.infos.timeline.ready.waiting'),
      textColor: theme.secondary64,
      iconColor: theme.secondary0,
      circleBackgroundColor: theme.secondary0,
      circleBorderColor: theme.secondary12,
    ));

    // Handle STEP-BY-STEP statuses
    // Status > none (min placed)
    if (orderStatus.index > OrderStatus.none.index) {
      results[0] = OrderStatusTimelineData(
        icon: OrderStatusTimelineIconState.finished,
        message: trans(context, 'orders.infos.timeline.none.finished'),
        iconColor: theme.secondary0,
        textColor: theme.secondary64,
        bottomLineColor: theme.highlight,
        circleBackgroundColor: theme.highlight,
        circleBorderColor: theme.highlight,
      );
      results[1] = OrderStatusTimelineData(
        icon: OrderStatusTimelineIconState.finished,
        message: trans(context, 'orders.infos.timeline.placed.finished'),
        iconColor: theme.secondary0,
        textColor: theme.secondary,
        bottomLineColor: theme.secondary12,
        circleBackgroundColor: theme.highlight,
        circleBorderColor: theme.highlight,
      );
    }

    // Status > placed (min processing)
    if (orderStatus.index > OrderStatus.placed.index) {
      results[1] = OrderStatusTimelineData(
        icon: OrderStatusTimelineIconState.finished,
        message: trans(context, 'orders.infos.timeline.placed.finished'),
        iconColor: theme.secondary0,
        textColor: theme.secondary64,
        bottomLineColor: theme.highlight,
        circleBackgroundColor: theme.highlight,
        circleBorderColor: theme.highlight,
      );
      results[2] = OrderStatusTimelineData(
        icon: OrderStatusTimelineIconState.processing,
        message: trans(context, 'orders.infos.timeline.processing.waiting'),
        iconColor: theme.secondary0,
        textColor: theme.secondary,
        bottomLineColor: theme.secondary12,
        circleBackgroundColor: theme.highlight,
        circleBorderColor: theme.highlight,
      );
    }

    // Status > processing (min ready)
    if (orderStatus.index > OrderStatus.processing.index) {
      results[2] = OrderStatusTimelineData(
        icon: OrderStatusTimelineIconState.finished,
        message: trans(context, 'orders.infos.timeline.processing.finished'),
        iconColor: theme.secondary0,
        textColor: theme.secondary64,
        bottomLineColor: theme.highlight,
        circleBackgroundColor: theme.highlight,
        circleBorderColor: theme.highlight,
      );
      results[3] = OrderStatusTimelineData(
        icon: OrderStatusTimelineIconState.processing,
        message: trans(context, 'orders.infos.timeline.ready.waiting'),
        iconColor: theme.secondary0,
        textColor: theme.secondary,
        // bottomLineColor: theme.secondary12,
        circleBackgroundColor: theme.highlight,
        circleBorderColor: theme.highlight,
      );
    }

    // Status > ready (min served)
    if (orderStatus.index > OrderStatus.ready.index) {
      results[3] = OrderStatusTimelineData(
        icon: OrderStatusTimelineIconState.finished,
        message: trans(context, 'orders.infos.timeline.ready.finished'),
        iconColor: theme.secondary0,
        textColor: theme.secondary,
        // bottomLineColor: theme.secondary12,
        circleBackgroundColor: theme.highlight,
        circleBorderColor: theme.highlight,
      );
    }

    return results;
  }

  Widget _buildSimpleRowWidget(BuildContext context) {
    bool served = status.status == OrderStatus.served;

    return Container(
      width: double.infinity,
      // padding: EdgeInsets.only(left: 16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            trans(context, 'orders.details.orderState'),
            style: Fonts.satoshi(
              fontSize: 24.0,
              fontWeight: FontWeight.w700,
              color: theme.secondary,
            ),
          ),
          SizedBox(
            height: 24.0,
          ),
          Row(
            mainAxisAlignment: MainAxisAlignment.start,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Padding(
                padding: const EdgeInsets.only(right: 16.0),
                child: Icon(
                  served ? Icons.check_circle_outline : Icons.highlight_off,
                  color: theme.secondary,
                ),
              ),
              Text(
                trans(
                  context,
                  served
                      ? 'orders.statusExt.served'
                      : 'orders.statusExt.rejected',
                ),
                style: Fonts.satoshi(
                  fontSize: 14,
                  color: theme.secondary,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ],
          ),
          SizedBox(
            height: 48.0,
          )
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    OrderStatus s = status.status;
    if (s == OrderStatus.served ||
        s == OrderStatus.rejected ||
        s == OrderStatus.failed) {
      return _buildSimpleRowWidget(context);
    }

    var timelineData = _calculateTimelineData(context);
    return Container(
      width: double.infinity,
      // padding: EdgeInsets.only(left: 16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            trans(context, 'orders.details.orderState'),
            style: Fonts.satoshi(
              fontSize: 24.0,
              fontWeight: FontWeight.w700,
              color: theme.secondary,
            ),
          ),
          SizedBox(
            height: 24.0,
          ),
          ListView.builder(
            primary: false,
            shrinkWrap: true,
            physics: NeverScrollableScrollPhysics(),
            itemCount: timelineData.length,
            itemBuilder: (context, index) {
              return OrderStatusTimelineItemWidget(
                data: timelineData[index],
              );
            },
          )
        ],
      ),
    );
  }
}

class OrderStatusTimelineItemWidget extends StatelessWidget {
  final OrderStatusTimelineData data;

  const OrderStatusTimelineItemWidget({Key? key, required this.data})
      : super(key: key);

  IconData get iconFromType {
    switch (data.icon) {
      case OrderStatusTimelineIconState.not_started:
        return Icons.fiber_manual_record;
      case OrderStatusTimelineIconState.failed:
        return Icons.close;
      case OrderStatusTimelineIconState.none:
        return Icons.done;
      case OrderStatusTimelineIconState.finished:
        return Icons.done;
      case OrderStatusTimelineIconState.processing:
        return Icons.fiber_manual_record;
    }
  }

  @override
  Widget build(BuildContext context) {
    IconData icon = iconFromType;

    return Container(
      width: double.infinity,
      child: Row(
        mainAxisAlignment: MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Icon with bottom line
          Column(
            mainAxisAlignment: MainAxisAlignment.start,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              BorderedWidget(
                width: 24.0,
                height: 24.0,
                borderWidth: 2.0,
                borderColor: data.circleBorderColor,
                color: data.circleBackgroundColor,
                child: Icon(
                  icon,
                  size: 16,
                  color: data.iconColor,
                ),
              ),
              Container(
                margin: EdgeInsets.symmetric(vertical: 4.0),
                height: 48.0,
                width: 2.0,
                color: data.bottomLineColor,
              ),
            ],
          ),
          // Status text
          Expanded(
            child: Container(
              padding: EdgeInsets.only(
                left: 12.0,
              ),
              child: Text(
                data.message,
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
                style: Fonts.satoshi(
                  fontSize: 16.0,
                  fontWeight: FontWeight.w400,
                  color: data.textColor,
                ),
              ),
            ),
          )
        ],
      ),
    );
  }
}

class OrderDetailsInfoTable extends StatelessWidget {
  final Order order;
  final GeoUnit unit;

  const OrderDetailsInfoTable({
    Key? key,
    required this.order,
    required this.unit,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            trans(context, 'orders.details.otherDetails'),
            style: Fonts.satoshi(
              fontSize: 24.0,
              fontWeight: FontWeight.w700,
              color: theme.secondary,
            ),
          ),
          SizedBox(
            height: 20.0,
          ),
          ListView.builder(
            shrinkWrap: true,
            primary: false,
            itemCount: 5,
            physics: NeverScrollableScrollPhysics(),
            itemBuilder: (context, index) {
              return OrderDetailsInfoTableItem(
                pos: index,
                order: order,
                unit: unit,
              );
            },
          )
        ],
      ),
    );
  }
}

class OrderDetailsInfoTableItemData {
  final IconData icon;
  final String title;
  final String value;

  const OrderDetailsInfoTableItemData(
      {required this.icon, required this.title, required this.value});
}

class OrderDetailsInfoTableItem extends StatelessWidget {
  final int pos;
  final Order order;
  final GeoUnit unit;

  const OrderDetailsInfoTableItem(
      {Key? key, required this.pos, required this.order, required this.unit})
      : super(key: key);

  OrderDetailsInfoTableItemData _generateItemData(BuildContext context) {
    switch (pos) {
      case 0:
        return OrderDetailsInfoTableItemData(
          icon: Icons.location_on_rounded,
          title: trans(context, 'orders.infos.titles.0'),
          value: unit.name,
        );
      case 1:
        return OrderDetailsInfoTableItemData(
          icon: order.servingMode == ServingMode.takeAway
              ? Icons.arrow_left
              : Icons.arrow_right,
          title: trans(context, 'orders.infos.titles.1'),
          value: order.servingMode == ServingMode.takeAway
              ? trans(context, 'cart.takeAway').capitalize()
              : trans(context, 'cart.inPlace').capitalize(),
        );
      case 2:
        return OrderDetailsInfoTableItemData(
          icon: Icons.receipt_long_rounded,
          title: trans(context, 'orders.infos.titles.2'),
          value: '#${order.orderNum}',
        );
      case 3:
        var createdAt = dateFormatter.format(order.createdAt);
        return OrderDetailsInfoTableItemData(
          icon: Icons.event,
          title: trans(context, 'orders.infos.titles.3'),
          value: createdAt,
        );
      case 4:
        var createdAt = timeFormatter.format(order.createdAt);
        return OrderDetailsInfoTableItemData(
          icon: Icons.schedule_rounded,
          title: trans(context, 'orders.infos.titles.4'),
          value: createdAt,
        );
      default:
        return OrderDetailsInfoTableItemData(
          icon: Icons.help_outline_sharp,
          title: '',
          value: '',
        );
    }
  }

  @override
  Widget build(BuildContext context) {
    var data = _generateItemData(context);

    return Container(
      // color: theme.secondary,
      padding: EdgeInsets.only(
        top: 8.0,
      ),

      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.start,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Flexible(
                flex: 12,
                child: Row(
                  children: [
                    Container(
                      padding: EdgeInsets.all(8.0),
                      child: _getIcon(data),
                    ),
                    Text(
                      data.title,
                      style: Fonts.satoshi(
                        fontSize: 14,
                        color: theme.secondary,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ],
                ),
              ),
              Flexible(
                flex: 7,
                child: Text(
                  data.value,
                  style: Fonts.satoshi(
                    fontSize: 14,
                    color: theme.secondary64,
                    fontWeight: FontWeight.w400,
                  ),
                ),
              ),
            ],
          ),
          SizedBox(
            height: 8.0,
          ),
          Divider(
            color: theme.secondary16,
            height: 1.0,
          ),
        ],
      ),
    );
  }

  Widget _getIcon(OrderDetailsInfoTableItemData data) {
    if (data.icon == Icons.shopping_bag_outlined) {
      return SvgPicture.asset(
        "assets/icons/bag.svg",
        color: theme.secondary,
      );
    }

    if (data.icon == Icons.arrow_left) {
      return SvgPicture.asset(
        "assets/icons/bag.svg",
        color: theme.secondary,
      );
    }

    if (data.icon == Icons.arrow_right) {
      return SvgPicture.asset(
        'assets/icons/restaurant_menu_black.svg',
        color: theme.secondary,
      );
    }

    return Icon(
      data.icon,
      color: theme.secondary,
    );
  }
}
