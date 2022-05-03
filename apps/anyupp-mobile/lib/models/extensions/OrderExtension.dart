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

  double get totalPrice => sumPriceShown.priceSum + serviceFeePrice;

  double get serviceFeePrice => this.servingMode != ServingMode.inPlace
      ? 0
      : (serviceFee?.grossPrice ?? 0.0);

  OrderStatus get status => currentStatus ?? OrderStatus.none;
}
