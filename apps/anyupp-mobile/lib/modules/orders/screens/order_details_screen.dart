import 'package:fa_prev/core/theme/theme.dart';
import 'package:fa_prev/graphql/generated/crud-api.dart';
import 'package:fa_prev/graphql/utils/graphql_coercers.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/shared/nav.dart';
import 'package:fa_prev/shared/utils/format_utils.dart';
import 'package:fa_prev/shared/utils/pdf_utils.dart';
import 'package:fa_prev/shared/widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

class OrderDetailsScreen extends StatelessWidget {
  final Order order;
  final GeoUnit unit;

  const OrderDetailsScreen({Key? key, required this.order, required this.unit}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    setToolbarThemeV2(theme);

    return Scaffold(
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
          dateWithDayFormatter.format(fromGraphQLAWSDateTimeToDartDateTime(order.createdAt!)),
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
        // actions: <Widget>[
        //   Padding(
        //     padding: const EdgeInsets.only(
        //       top: 8.0,
        //       bottom: 8.0,
        //       right: 15.0,
        //     ),
        //     child: BorderedWidget(
        //       width: 40,
        //       child: Icon(
        //         Icons.help,
        //         color: theme.secondary,
        //       ),
        //     ),
        //   ),
        // ],
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
                  status: order.statusLog[order.statusLog.length - 1],
                ),
              ),
              OrderDetailsInfoTextWidget(
                order: order,
                unit: unit,
              ),
              Padding(
                padding: const EdgeInsets.all(16.0),
                child: OrderDetailsPaymentInfoWidget(
                  order: order,
                ),
              ),
              SizedBox(
                height: 48.0,
              ),
              OrderDetailsInfoTable(
                order: order,
                unit: unit,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class OrderDetailsPaymentInfoWidget extends StatelessWidget {
  final Order order;

  const OrderDetailsPaymentInfoWidget({Key? key, required this.order}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    IconData icon = Icons.payments_rounded;
    String date = '';
    if (order.paymentMode.method == PaymentMethod.inapp || order.paymentMode.method == PaymentMethod.card) {
      icon = Icons.credit_card_outlined;
      // if (order.transaction?.createdAt != null) {
      //   date = dateTimeFormatter.format(fromGraphQLAWSDateTimeToDartDateTime(order.transaction!.createdAt!));
      // }
    }
    print('orderdetauils.order.transaction?.createdAt=${order.transaction?.createdAt}');
    if (order.transaction?.createdAt != null) {
      date = dateTimeFormatter.format(fromGraphQLAWSDateTimeToDartDateTime(order.transaction!.createdAt!));
    }

    bool showButton = order.transaction?.receipt?.pdfData != null || order.transaction?.invoice?.pdfUrl != null;
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
              Row(
                children: [
                  Icon(
                    icon,
                    color: theme.secondary,
                  ),
                  SizedBox(
                    width: 18.0,
                  ),
                  Text(
                    trans(context, 'orders.paymentDetails.${enumToString(order.paymentMode.method)}'),
                    style: Fonts.satoshi(
                      color: theme.secondary,
                      fontWeight: FontWeight.w400,
                      fontSize: 14.0,
                    ),
                  )
                ],
              ),
              Spacer(),
              Container(
                child: Text(
                  date,
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
                  primary: theme.primary,
                  // shadowColor: null,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10),
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
                    color: theme.secondary0,
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

  const OrderDetailsInfoTextWidget({Key? key, required this.order, required this.unit}) : super(key: key);

  @override
  Widget build(BuildContext context) {
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
                    return Container(
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
                    formatCurrency(order.sumPriceShown.priceSum, order.items[0].priceShown.currency),
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

  const OrderDetailsInfoTextItemWidget({Key? key, required this.item, required this.unit}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    var extraNames = _getExtraNames(context);

    return Container(
      child: Column(
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
      ),
    );
  }

  List<String> _getExtraNames(BuildContext context) {
    List<String> extraNames = [];
    if (item.selectedConfigMap != null) {
      item.selectedConfigMap!.forEach((key, value) {
        for (GeneratedProductConfigComponent generatedProductConfigComponent in value) {
          extraNames.add(getLocalizedText(context, generatedProductConfigComponent.name));
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

  const OrderStatusTimelineWidget({Key? key, required this.status}) : super(key: key);

  List<OrderStatusTimelineData> _calculateTimelineData(BuildContext context) {
    List<OrderStatusTimelineData> results = [];
    OrderStatus orderStatus = enumFromString(status.status, OrderStatus.values);
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
        circleBackgroundColor: theme.primary,
        circleBorderColor: theme.primary,
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
      circleBackgroundColor: theme.primary,
      circleBorderColor: theme.primary,
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
        bottomLineColor: theme.primary,
        circleBackgroundColor: theme.primary,
        circleBorderColor: theme.primary,
      );
      results[1] = OrderStatusTimelineData(
        icon: OrderStatusTimelineIconState.finished,
        message: trans(context, 'orders.infos.timeline.placed.finished'),
        iconColor: theme.secondary0,
        textColor: theme.secondary,
        bottomLineColor: theme.secondary12,
        circleBackgroundColor: theme.primary,
        circleBorderColor: theme.primary,
      );
    }

    // Status > placed (min processing)
    if (orderStatus.index > OrderStatus.placed.index) {
      results[1] = OrderStatusTimelineData(
        icon: OrderStatusTimelineIconState.finished,
        message: trans(context, 'orders.infos.timeline.placed.finished'),
        iconColor: theme.secondary0,
        textColor: theme.secondary64,
        bottomLineColor: theme.primary,
        circleBackgroundColor: theme.primary,
        circleBorderColor: theme.primary,
      );
      results[2] = OrderStatusTimelineData(
        icon: OrderStatusTimelineIconState.processing,
        message: trans(context, 'orders.infos.timeline.processing.waiting'),
        iconColor: theme.secondary0,
        textColor: theme.secondary,
        bottomLineColor: theme.secondary12,
        circleBackgroundColor: theme.primary,
        circleBorderColor: theme.primary,
      );
    }

    // Status > processing (min ready)
    if (orderStatus.index > OrderStatus.processing.index) {
      results[2] = OrderStatusTimelineData(
        icon: OrderStatusTimelineIconState.finished,
        message: trans(context, 'orders.infos.timeline.processing.finished'),
        iconColor: theme.secondary0,
        textColor: theme.secondary64,
        bottomLineColor: theme.primary,
        circleBackgroundColor: theme.primary,
        circleBorderColor: theme.primary,
      );
      results[3] = OrderStatusTimelineData(
        icon: OrderStatusTimelineIconState.processing,
        message: trans(context, 'orders.infos.timeline.ready.waiting'),
        iconColor: theme.secondary0,
        textColor: theme.secondary,
        // bottomLineColor: theme.secondary12,
        circleBackgroundColor: theme.primary,
        circleBorderColor: theme.primary,
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
        circleBackgroundColor: theme.primary,
        circleBorderColor: theme.primary,
      );
    }

    return results;
  }

  @override
  Widget build(BuildContext context) {
    // IconData icon = Icons.hourglass_bottom_outlined;
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

  const OrderStatusTimelineItemWidget({Key? key, required this.data}) : super(key: key);

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
            itemCount: 4,
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

  const OrderDetailsInfoTableItemData({required this.icon, required this.title, required this.value});
}

class OrderDetailsInfoTableItem extends StatelessWidget {
  final int pos;
  final Order order;
  final GeoUnit unit;

  const OrderDetailsInfoTableItem({Key? key, required this.pos, required this.order, required this.unit})
      : super(key: key);

  OrderDetailsInfoTableItemData _generateItemData(BuildContext context) {
    switch (pos) {
      case 0:
        return OrderDetailsInfoTableItemData(
          icon: Icons.shopping_bag_outlined,
          title: trans(context, 'orders.infos.titles.2'),
          value: unit.name,
        );
      case 1:
        return OrderDetailsInfoTableItemData(
          icon: Icons.receipt_long_outlined,
          title: trans(context, 'orders.infos.titles.3'),
          value: '#${order.orderNum}',
        );
      case 2:
        var createdAt = dateFormatter.format(fromGraphQLAWSDateTimeToDartDateTime(order.createdAt!));
        return OrderDetailsInfoTableItemData(
          icon: Icons.event,
          title: trans(context, 'orders.infos.titles.5'),
          value: createdAt,
        );
      case 3:
        var createdAt = timeFormatter.format(fromGraphQLAWSDateTimeToDartDateTime(order.createdAt!));
        return OrderDetailsInfoTableItemData(
          icon: Icons.schedule_outlined,
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

      child: Row(
        mainAxisAlignment: MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Flexible(
            flex: 12,
            child: Row(
              children: [
                Container(
                  padding: EdgeInsets.all(8.0),
                  child: data.icon == Icons.shopping_bag_outlined
                      ? SvgPicture.asset(
                          "assets/icons/bag.svg",
                          color: theme.secondary,
                        )
                      : Icon(
                          data.icon,
                          color: theme.secondary,
                        ),
                ),
                Text(
                  data.title,
                  style: Fonts.satoshi(
                    fontSize: 12,
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
                fontSize: 12,
                color: theme.secondary,
                fontWeight: FontWeight.w400,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
