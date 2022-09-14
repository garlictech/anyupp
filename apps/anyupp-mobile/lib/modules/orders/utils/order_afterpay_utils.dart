import '/models.dart';
import '/core/logger.dart';

Order? aggregateOrders(List<Order> orders) {
  log.d('******** aggregateOrders().length=${orders.length}');
  if (orders.isEmpty) {
    return null;
  }

  var last = orders.last;

  return last.copyWith(
      statusLog: orders
          .reduce((current, next) =>
              current.status.index < next.status.index ? current : next)
          .statusLog,
      items: orders.expand((order) => order.items).toList(),
      sumPriceShown: last.sumPriceShown.copyWith(
        priceSum:
            orders.fold(0, (sum, order) => sum! + order.sumPriceShown.priceSum),
      ),
      packagingSum: last.packagingSum?.copyWith(
        netPrice: orders.fold(
          0,
          (sum, order) =>
              sum! +
              (order.packagingSum?.netPrice ?? 0) *
                  (1 + (order.packagingSum?.taxPercentage ?? 0)),
        ),
      ),
      serviceFee: last.serviceFee?.copyWith(
        grossPrice: orders.fold(
          0,
          (sum, order) => sum! + (order.serviceFee?.grossPrice ?? 0),
        ),
      ),
      tip: last.tip?.copyWith(
        value: orders.fold(0, (sum, order) => sum! + (order.tip?.value ?? 0)),
      ));
}

Map<String?, List<Order>> groupOrdersByTransactionId({
  List<Order> orders = const [],
}) {
  return orders.groupBy((order) => order.transactionId);
}

List<List<Order>> groupOrdersListByTransactionId({
  List<Order> orders = const [],
}) {
  var map = orders.groupBy((order) => order.transactionId);
  List<List<Order>> result = [];
  map.forEach((key, value) {
    if (key == null) {
      result.addAll(value.map((e) => [e]).toList());
    } else {
      result.add(value);
    }
  });
  return result;
}

List<Order> groupOrdersListByTransactionIdWithMerge({
  List<Order> orders = const [],
}) {
  var map = orders.groupBy((order) => order.transactionId);
  List<Order> result = [];
  map.forEach((key, value) {
    if (key == null) {
      result.addAll(value.map((e) => e).toList());
    } else if (value.isNotEmpty) {
      result.add(aggregateOrders(value)!);
    }
  });
  return result;
}
