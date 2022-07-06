import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/graphql/generated/crud-api.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/shared/utils/unit_utils.dart';
import 'package:intl/intl.dart';

extension OrderExtension on Order {
  String getFormattedDate() {
    log.d('OrderExtension.getFormattedDate.createdAt()=$createdAt');
    final DateFormat formatter = DateFormat('yyyy-MM-dd HH:mm:ss');
    try {
      return formatter.format(createdAt);
    } on Exception {
      return '';
    }
  }

  double get totalPrice => sumPriceShown.priceSum + serviceFeePrice;

  double get serviceFeePrice => this.servingMode != ServingMode.inPlace
      ? 0
      : (serviceFee?.grossPrice ?? 0.0);

  OrderStatus get status => statusLog != null && statusLog?.isNotEmpty == true
      ? statusLog!.last.status
      : OrderStatus.none;

  StatusLog? get lastLog =>
      statusLog?.isNotEmpty == true ? statusLog?.last : null;

  bool get isAfterPayOrdersReadyToPay =>
      currentUnit?.orderPaymentPolicy == OrderPaymentPolicy.afterpay &&
      transactionStatus == PaymentStatus.waitingForPayment &&
      (status == OrderStatus.ready || status == OrderStatus.served) &&
      transactionId == null;
}
