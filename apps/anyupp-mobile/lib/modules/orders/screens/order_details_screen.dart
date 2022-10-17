import 'dart:math';

import '/core/core.dart';
import '/graphql/generated/crud-api.dart';
import '/graphql/utils/graphql_coercers.dart';
import '/models.dart';
import '/modules/orders/orders.dart';
import '/modules/rating_tipping/rating_tipping.dart';
import '/shared/locale.dart';
import '/shared/utils/format_utils.dart';
import '/shared/utils/pdf_utils.dart';
import '/shared/widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:url_launcher/url_launcher_string.dart';

class OrderDetailsScreen extends StatefulWidget {
  final Order order;
  // final Unit unit;

  const OrderDetailsScreen({Key? key, required this.order}) : super(key: key);

  @override
  State<OrderDetailsScreen> createState() => _OrderDetailsScreenState(order);
}

class _OrderDetailsScreenState extends State<OrderDetailsScreen> {
  late Order _order;

  _OrderDetailsScreenState(Order order) {
    _order = order;
  }

  @override
  Widget build(BuildContext context) {
    setToolbarThemeV2(theme);

    return MultiBlocListener(
      listeners: [
        BlocListener<OrderRefreshBloc, OrderRefreshState>(
          listener: (context, state) {
            // log.d('******* OrderDetailsScreen().listener.state=$state');
            if (state is OrderRefreshed) {
              setState(() {
                _order = state.order;
              });
            }
          },
        ),
        BlocListener<RatingBloc, RatingState>(
          listener: (context, state) {
            // log.d('******* OrderDetailsScreen().listener.state=$state');
            if (state is RatingSuccess) {
              getIt<OrderBloc>().add(StartGetOrderListSubscription());
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
                widget.order.orderPolicy == OrderPolicy.full
                    ? Padding(
                        padding: const EdgeInsets.all(16.0),
                        child: OrderStatusTimelineWidget(
                          orderStatus: _order.status,
                          orderNum: _order.orderNum,
                        ),
                      )
                    : Container(),
                OrderDetailsInfoTextWidget(
                  order: _order,
                ),
                OrderDetailsRatingAndTipWidget(order: _order),
                OrderDetailsTipAndServingFeeWidget(
                  order: _order,
                ),
                Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: OrderDetailsPaymentInfoWidget(
                    order: _order,
                  ),
                ),
                SizedBox(
                  height: 28.0,
                ),
                OrderDetailsInfoTable(
                  order: _order,
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

  const OrderDetailsServiceFeePriceWidget({
    Key? key,
    required this.order,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    if (order.serviceFee == null || (order.serviceFee?.grossPrice ?? 0) == 0) {
      return Container();
    }

    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          '${trans(context, 'cart.serviceFee')} ${formatDouble(order.serviceFeePolicy?.percentage)}%',
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
                text: '  x  ',
                style: Fonts.satoshi(
                  color: theme.secondary40,
                  fontSize: 14,
                  fontWeight: FontWeight.w400,
                ),
              ),
              TextSpan(
                text: formatCurrency(order.serviceFee?.grossPrice ?? 0,
                    order.sumPriceShown.currency),
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
  }
}

class OrderDetailsPackagingFeeWidget extends StatelessWidget {
  final Order order;
  OrderDetailsPackagingFeeWidget({
    Key? key,
    required this.order,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          trans(context, 'cart.packagingFee'),
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
                text: '  x  ',
                style: Fonts.satoshi(
                  color: theme.secondary40,
                  fontSize: 14,
                  fontWeight: FontWeight.w400,
                ),
              ),
              TextSpan(
                text: formatCurrency(order.packagingSum?.totalPrice ?? 0,
                    order.sumPriceShown.currency),
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
  }
}

class OrderDetailsServiceFeeWidget extends StatelessWidget {
  final Order order;

  const OrderDetailsServiceFeeWidget({
    Key? key,
    required this.order,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    if (order.serviceFee == null || (order.serviceFee?.grossPrice ?? 0) == 0) {
      return Container();
    }

    return Text(
      trans(context, 'orders.details.serviceFee',
          [formatDouble(order.serviceFeePolicy?.percentage)]),
      style: Fonts.satoshi(
        color: theme.secondary64,
        fontSize: 14.0,
      ),
    );
  }
}

class OrderDetailsTipAndServingFeeWidget extends StatelessWidget {
  final Order order;
  OrderDetailsTipAndServingFeeWidget({Key? key, required this.order});

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
                  formatCurrency(
                      order.tip?.value ?? 0, order.sumPriceShown.currency),
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

  OrderDetailsRatingAndTipWidget({Key? key, required this.order})
      : super(key: key);

  void _showRatingModal(
      {required BuildContext context,
      required Transaction transaction,
      TipPolicy? tipPolicy,
      RatingPolicy? ratingPolicy}) {
    showModalBottomSheet(
      context: context,
      isDismissible: true,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.only(
          topLeft: Radius.circular(16.0),
          topRight: Radius.circular(16.0),
        ),
      ),
      enableDrag: true,
      isScrollControlled: true,
      elevation: 4.0,
      backgroundColor: Colors.transparent,
      builder: (context) {
        return Container(
          height: MediaQuery.of(context).size.height * .9,
          child: RatingAndTippingModal(
            ratingPolicy: ratingPolicy,
            tipPolicy: tipPolicy,
            transaction: transaction,
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    if (!shouldDisplayRating(order)) {
      return Container();
    }

    return Column(
      children: [
        if (order.ratingPolicies?.isNotEmpty == true && order.hasRated != true)
          Container(
            height: 56.0,
            width: double.infinity,
            margin: EdgeInsets.symmetric(horizontal: 16.0),
            child: ElevatedButton(
              onPressed: () {
                if (order.transaction != null) {
                  order.ratingPolicies!.shuffle();
                  _showRatingModal(
                      context: context,
                      ratingPolicy: order.ratingPolicies![
                          Random().nextInt(order.ratingPolicies!.length)],
                      transaction: order.transaction!);
                }
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: lighten(theme.button, 76),
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
                  color: theme.button,
                ),
              ),
            ),
          ),
        if (order.tipPolicy != null &&
            order.tipPolicy?.isNotEmpty == true &&
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
              onPressed: () {
                if (order.transaction != null) {
                  _showRatingModal(
                      context: context,
                      tipPolicy: order.tipPolicy,
                      transaction: order.transaction!);
                }
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: theme.button,
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
    // log.d('orderdetauils.order.transaction?.createdAt=${order.transaction?.createdAt}');
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
          SizedBox(
            height: 28.0,
          ),
          Text(
            trans(context, 'orders.details.paymentDetails'),
            style: Fonts.satoshi(
              fontSize: 24.0,
              fontWeight: FontWeight.w700,
              color: theme.secondary,
            ),
          ),
          SizedBox(
            height: 17.0,
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
                    ? launchUrlString(order.transaction!.invoice!
                        .pdfUrl!) // Nav.to(PdfWebView(order.transaction!.invoice!.pdfUrl!))
                    : createAndOpenPdf(order.transaction!.receipt!.pdfData),
                style: ElevatedButton.styleFrom(
                  backgroundColor: theme.button,
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

  const OrderDetailsInfoTextWidget({Key? key, required this.order})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    bool isTakeAway = order.servingMode == ServingMode.takeAway;
    bool isServiceFee = order.serviceFeePolicy?.type != null &&
        order.serviceFeePolicy?.percentage != null &&
        order.serviceFee != null &&
        !isTakeAway;

    bool isServiceFeeIncluded =
        order.serviceFeePolicy?.type == ServiceFeeType.included;

    // log.d(
    //     'OrderDetailsInfo..sumPriceShown.priceSum=${order.sumPriceShown.priceSum}');
    // log.d('OrderDetailsInfo.totalPrice=${order.totalPrice}');
    // log.d('OrderDetailsInfo.serviceFeePrice=${order.serviceFeePrice}');
    // log.d('OrderDetailsInfo.servingMode=${order.servingMode}');
    // log.d(
    //     'OrderDetailsInfo.packagingSum.totalPrice=${order.packagingSum?.totalPrice}');
    // log.d(
    //     'OrderDetailsInfo.packagingSum.netPrice=${order.packagingSum?.netPrice}');
    // log.d(
    //     'OrderDetailsInfo.packagingSum.taxPercentage=${order.packagingSum?.taxPercentage}');

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
                  // order.orderPolicy == OrderPolicy.full
                  //     ? trans(context, 'orders.details.orderDetailsWithNum',
                  //         [order.orderNum])
                  //     : trans(context, 'orders.details.orderDetails'),
                  style: Fonts.hH1(
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
                    return index == order.items.length - 1
                        ? isServiceFee
                            ? Column(
                                mainAxisAlignment: MainAxisAlignment.start,
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  OrderDetailsInfoTextItemWidget(
                                    order: order,
                                    item: order.items[index],
                                  ),
                                  Padding(
                                    padding: const EdgeInsets.only(top: 16.0),
                                    // child: OrderDetailsServiceFeeWidget(
                                    //   order: order,
                                    //   unit: unit,
                                    // )

                                    child: isServiceFeeIncluded
                                        ? OrderDetailsServiceFeeWidget(
                                            order: order,
                                          )
                                        : OrderDetailsServiceFeePriceWidget(
                                            order: order,
                                          ),
                                  ),
                                ],
                              )
                            : isTakeAway
                                ? Column(
                                    mainAxisAlignment: MainAxisAlignment.start,
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      OrderDetailsInfoTextItemWidget(
                                        order: order,
                                        item: order.items[index],
                                      ),
                                      Padding(
                                        padding:
                                            const EdgeInsets.only(top: 16.0),
                                        child: OrderDetailsPackagingFeeWidget(
                                          order: order,
                                        ),
                                      ),
                                    ],
                                  )
                                : Container(
                                    padding: EdgeInsets.only(
                                        top: index > 0 ? 32 : 0),
                                    child: OrderDetailsInfoTextItemWidget(
                                      order: order,
                                      item: order.items[index],
                                    ),
                                  )
                        : Container(
                            padding: EdgeInsets.only(top: index > 0 ? 32 : 0),
                            child: OrderDetailsInfoTextItemWidget(
                              order: order,
                              item: order.items[index],
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
                        order.totalPrice, order.items[0].priceShown.currency),
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
  final Order order;
  final OrderItem item;

  const OrderDetailsInfoTextItemWidget({
    Key? key,
    required this.order,
    required this.item,
  }) : super(key: key);

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
                    text: '  x  ',
                    style: Fonts.satoshi(
                      color: theme.secondary40,
                      fontSize: 14,
                      fontWeight: FontWeight.w400,
                    ),
                  ),
                  TextSpan(
                    text: formatCurrency(item.getPrice(order.serviceFeePolicy),
                        order.sumPriceShown.currency),
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
        for (ProductConfigComponent generatedProductConfigComponent in value) {
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
  final OrderStatus orderStatus;
  final String? orderNum;

  const OrderStatusTimelineWidget({
    Key? key,
    required this.orderStatus,
    this.orderNum,
  }) : super(key: key);

  List<OrderStatusTimelineData> _calculateTimelineData(BuildContext context) {
    List<OrderStatusTimelineData> results = [];
    // log.d('_calculateTimelineData.state=$orderStatus');
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
    bool served = orderStatus == OrderStatus.served;

    return Container(
      width: double.infinity,
      // padding: EdgeInsets.only(left: 16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            orderNum != null
                //? trans(context, 'orders.details.orderStateWithNum', [orderNum])
                ? trans(context, 'orders.details.orderState')
                : trans(context, 'orders.details.orderState'),
            // trans(context, 'orders.details.orderState'),
            style: Fonts.satoshi(
              fontSize: 24.0,
              fontWeight: FontWeight.w700,
              color: theme.secondary,
            ),
          ),
          if (orderNum != null) SizedBox(
            height: 8.0,
          ),
          if (orderNum != null) Center(
            child: Text(
              "$orderNum",
              style: Fonts.satoshi(
                fontSize: 64.0,
                fontWeight: FontWeight.w700,
                color: theme.highlight,
              ),
            ),
          ),
          SizedBox(
            height: 8.0,
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
            height: 38.0,
          )
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    OrderStatus s = orderStatus;
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

  const OrderDetailsInfoTable({
    Key? key,
    required this.order,
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
            height: 14.0,
          ),
          ListView.builder(
            shrinkWrap: true,
            primary: false,
            itemCount: 4,
            physics: NeverScrollableScrollPhysics(),
            itemBuilder: (context, index) {
              return OrderDetailsInfoTableItem(
                pos: index,
                order: order,
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

  const OrderDetailsInfoTableItem({
    Key? key,
    required this.pos,
    required this.order,
  }) : super(key: key);

  OrderDetailsInfoTableItemData _generateItemData(BuildContext context) {
    // List<Unit>? units = getIt<UnitsBloc>().state;
    Unit? unit;
    var state = getIt<UnitsBloc>().state;
    if (state is UnitsLoaded) {
      int index = state.units.indexWhere((unit) => unit.id == order.unitId);
      if (index != -1) {
        unit = state.units[index];
      }
    }
    switch (pos) {
      case 0:
        return OrderDetailsInfoTableItemData(
          icon: Icons.location_on_rounded,
          title: trans(context, 'orders.infos.titles.0'),
          value: unit?.name ?? '-',
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
        var createdAt = dateFormatter.format(order.createdAt);
        return OrderDetailsInfoTableItemData(
          icon: Icons.event,
          title: trans(context, 'orders.infos.titles.3'),
          value: createdAt,
        );
      case 3:
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
