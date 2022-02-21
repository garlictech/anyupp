import 'package:fa_prev/models.dart';
import 'package:intl/intl.dart';
import 'package:fa_prev/graphql/generated/crud-api.dart';

extension OrderExtension on Order {
  String getFormattedDate() {
    print('OrderExtension.getFormattedDate.createdAt()=$createdAt');
    final DateFormat formatter = DateFormat('yyyy-MM-dd HH:mm:ss');
    try {
      return formatter.format(createdAt);
    } on Exception {
      return '';
    }
  }

  double get totalPrice =>
      this.sumPriceShown.priceSum +
      serviceFeePrice +
      (this.packagingSum?.netPrice ?? 0);

  double get serviceFeePrice => this.servingMode == ServingMode.takeAway
      ? 0
      : (this.serviceFee?.netPrice ?? 0) *
          (1 + (this.serviceFee?.taxPercentage ?? 0) / 100.0);
}
