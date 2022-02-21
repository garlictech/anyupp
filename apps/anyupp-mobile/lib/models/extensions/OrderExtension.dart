import 'package:fa_prev/models.dart';
import 'package:intl/intl.dart';

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
      (this.serviceFee?.netPrice ?? 0) *
          (1 + (this.serviceFee?.taxPercentage ?? 0) / 100.0) +
      (this.packagingSum?.netPrice ?? 0);
}
