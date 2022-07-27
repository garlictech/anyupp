import '/graphql/generated/crud-api.graphql.dart';
import '/models.dart';

Cart updateCartPrices(Cart cart) {
  assert(cart.sumPriceShown != null);

  var tmp = cart.copyWith(
    items: cart.items
        .map((item) => updateOrderItemPrices(
            cart.serviceFeePolicy, item, cart.packagingFeeTaxPercentage))
        .toList(),
  );

  CumulatedPrice? serviceFee;
  if (cart.serviceFeePolicy != null) {
    var serviceFeeGrossPrice = tmp.items.fold<double>(
        0,
        (prev, current) =>
            prev +
            getGrossPrice(current.serviceFee?.netPrice ?? 0,
                current.serviceFee?.taxPercentage ?? 0));

    var serviceFeeTaxContent = tmp.items.fold<double>(
        0,
        (prev, current) =>
            prev +
            (current.serviceFee?.netPrice ?? 0) *
                (current.serviceFee?.taxPercentage.toInt() ?? 0) /
                100);

    serviceFee = CumulatedPrice(
      currency: cart.sumPriceShown!.currency,
      grossPrice: serviceFeeGrossPrice,
      taxContent: serviceFeeTaxContent,
    );
  }

  var sumPrice = tmp.items.fold<PriceShown>(
    PriceShown(
      currency: tmp.items[0].sumPriceShown.currency,
      pricePerUnit: 0,
      priceSum: 0,
      tax: 0,
      taxSum: 0,
    ),
    (prev, current) => PriceShown(
      currency: cart.sumPriceShown!.currency,
      pricePerUnit: 0,
      tax: 0,
      priceSum: prev.priceSum + current.sumPriceShown.priceSum,
      taxSum: prev.taxSum + current.sumPriceShown.taxSum,
    ),
  );

  return tmp.copyWith(
    serviceFee: serviceFee,
    packagingSum: _getOrderTotalPackagingFee(
      cart.sumPriceShown!.currency,
      cart.packagingFeeTaxPercentage,
      tmp.items,
    ),
    sumPriceShown: sumPrice,
  );
}

Order updateOrderPrices(Order order) {
  var tmp = order.copyWith(
    items: order.items
        .map((item) => updateOrderItemPrices(
            order.serviceFeePolicy, item, order.packagingFeeTaxPercentage))
        .toList(),
  );

  CumulatedPrice? serviceFee;
  if (order.serviceFeePolicy != null) {
    var serviceFeeGrossPrice = tmp.items.fold<double>(
        0,
        (prev, current) =>
            prev +
            getGrossPrice(current.serviceFee?.netPrice ?? 0,
                current.serviceFee?.taxPercentage ?? 0));

    var serviceFeeTaxContent = tmp.items.fold<double>(
        0,
        (prev, current) =>
            prev +
            (current.serviceFee?.netPrice ?? 0) *
                (current.serviceFee?.taxPercentage.toInt() ?? 0) /
                100);

    serviceFee = CumulatedPrice(
      currency: order.sumPriceShown.currency,
      grossPrice: serviceFeeGrossPrice,
      taxContent: serviceFeeTaxContent,
    );
  }

  var sumPrice = tmp.items.fold<PriceShown>(
    PriceShown(
      currency: tmp.items[0].sumPriceShown.currency,
      pricePerUnit: 0,
      priceSum: 0,
      tax: 0,
      taxSum: 0,
    ),
    (prev, current) => PriceShown(
      currency: order.sumPriceShown.currency,
      pricePerUnit: 0,
      tax: 0,
      priceSum: prev.priceSum + current.sumPriceShown.priceSum,
      taxSum: prev.taxSum + current.sumPriceShown.taxSum,
    ),
  );

  return tmp.copyWith(
    serviceFee: serviceFee,
    packagingSum: _getOrderTotalPackagingFee(
      order.sumPriceShown.currency,
      order.packagingFeeTaxPercentage ?? 0,
      tmp.items,
    ),
    sumPriceShown: sumPrice,
  );
}

OrderItem updateOrderItemPrices(
    ServiceFeePolicy? serviceFeePolicy, OrderItem item, double? packagingTax) {
  var priceSum = item.priceShown.pricePerUnit * item.quantity;

  var price = item.priceShown.copyWith(
    priceSum: priceSum,
    taxSum: getTaxSum(priceSum, item.priceShown.tax),
  );

  Price? serviceFee;
  if (serviceFeePolicy != null) {
    serviceFee = Price(
      currency: price.currency,
      netPrice:
          getServiceFeeNetPrice(serviceFeePolicy, price.priceSum, price.tax),
      taxPercentage: price.tax.toDouble(),
    );
  }

  var sumPrice = PriceShown(
    currency: price.currency,
    pricePerUnit: price.pricePerUnit,
    priceSum: price.pricePerUnit * item.quantity,
    tax: item.priceShown.tax,
    taxSum: getTaxSum(
        item.priceShown.pricePerUnit * item.quantity, item.priceShown.tax),
  );

  var sumPriceSum = price.priceSum +
      getGrossPrice(item.netPackagingFee ?? 0,
          packagingTax ?? 0); // + getGrossPriceFromPrice(serviceFee);

  return item.copyWith(
    serviceFee: serviceFee, //getServiceFee(serviceFeePolicy, sumPrice),
    sumPriceShown: PriceShown(
      currency: sumPrice.currency,
      pricePerUnit: sumPrice.pricePerUnit,
      priceSum: sumPriceSum,
      tax: sumPrice.tax,
      taxSum: getTaxSum(sumPriceSum, sumPrice.tax),
    ),
    priceShown: price,
  );
}

double getServiceFeeNetPrice(ServiceFeePolicy policy, double price, int tax) {
  return (policy.percentage * (price / (1 + tax / 100.0)) / 100.0)
      .roundToDouble();
}

double getNetPriceFromTaxAndGrossPrice(double grossPrice, double tax) {
  return grossPrice / (1 + tax / 100.0);
}

double getServiceFeePrice(ServiceFeePolicy policy, double price) {
  return (policy.percentage * price / 100).roundToDouble();
}

double getConfigSetPrice(List<OrderItemConfigSet>? configSets) {
  if (configSets == null) {
    return 0;
  }

  return configSets.fold<double>(
    0,
    (prev, current) =>
        prev +
        current.items.fold(
          0,
          (prev, current) => prev + current.price,
        ),
  );
}

double getGrossPriceFromPrice(Price? price) {
  return getGrossPrice(price?.netPrice ?? 0, price?.taxPercentage ?? 0);
}

double getGrossPrice(double netPrice, double tax) {
  return (netPrice + (netPrice * tax / 100)).round().toDouble();
}

//  ==pricesShown.pricePerUnit + (serviceFee?.grossPrice ?? 0) / quantity + SUM(configs.price)

double getTaxSum(double price, int tax) {
  return (price * tax / (100 + tax)).round().toDouble();
}

Price getServiceFee(ServiceFeePolicy? policy, PriceShown price) {
  double serviceFee = _calculateServiceFee(policy, price);

  return Price(
    currency: price.currency,
    netPrice: serviceFee - _calculateServiceFeeTax(serviceFee, price),
    taxPercentage: price.tax.toDouble(),
  );
}

Price _getOrderTotalPackagingFee(
    String currency, double packagingTax, List<OrderItem> items) {
  var priceSum = items.fold<double>(items[0].netPackagingFee ?? 0,
      (prev, current) => prev += (current.netPackagingFee ?? 0));
  return Price(
    currency: currency,
    netPrice: priceSum.round().toDouble(),
    taxPercentage: packagingTax,
  );
}

CumulatedPrice getOrderTotalServiceFee(
  String currency,
  ServiceFeePolicy? serviceFeePolicy,
  List<OrderItem> items,
) {
  var priceList = items
      .map((item) => getServiceFee(serviceFeePolicy, item.priceShown))
      .toList();
  var priceInput = priceList.fold<PriceInput>(
      PriceInput(
        currency: currency,
        netPrice: 0,
        taxPercentage: serviceFeePolicy?.percentage ?? 0,
      ),
      (previous, current) => PriceInput(
            currency: currency,
            taxPercentage: previous.taxPercentage,
            netPrice: previous.netPrice + current.netPrice,
          ));
  return CumulatedPrice(
    currency: priceInput.currency,
    grossPrice: (priceInput.netPrice * (1 + priceInput.taxPercentage / 100))
        .round()
        .toDouble(),
    taxContent: priceInput.taxPercentage,
  );
}

double getNetPackagingFeeOfConfigComponent({
  required OrderItemInput item,
  required GeneratedProductConfigComponent component,
}) {
  return component.netPackagingFee ?? 0;
}

double getNetPackagingFeeOfConfigSets({
  required OrderItem item,
}) {
  return 0;
}

double getTotalNetPackagingFee(
    GeoUnit unit, ServingMode servingMode, List<OrderItem> items) {
  if (servingMode != ServingMode.takeAway) {
    return 0;
  }

  // double variantsPackagingFee =
  //     cart.items.fold<double>(0, (value, nextItem) => nextItem.);

  double componentPackagingFeeSum = items.fold<double>(
    0,
    (value, nextItem) => value += (nextItem.selectedConfigMap?.values
            .map((list) => _getPackagingFeeOfConfigSet(list))
            .toList()
            .reduce((a, b) => a += b) ??
        0),
  );

  return componentPackagingFeeSum *
      (1 + (unit.serviceFeePolicy?.percentage ?? 0));
}

double _getPackagingFeeOfConfigSet(
    List<GeneratedProductConfigComponent> component) {
  return component.fold(
    0,
    (previous, next) => previous += (next.netPackagingFee ?? 0),
  );
}

PriceInput getPackagingFeeOfItem(PriceShown price) {
  var totalPrice = (price.priceSum * price.tax) / 100;
  return PriceInput(
    currency: price.currency,
    netPrice: totalPrice - (1 + price.tax / 100),
    taxPercentage: price.tax.toDouble(),
  );
}

CumulatedPriceInput getTotalServiceFee(GeoUnit unit, List<OrderItem> items) {
  var priceList = items
      .map((item) => getServiceFee(unit.serviceFeePolicy, item.priceShown))
      .toList();
  var priceInput = priceList.fold<PriceInput>(
      PriceInput(
        currency: unit.currency,
        netPrice: 0,
        taxPercentage: unit.serviceFeePolicy?.percentage ?? 0,
      ),
      (previous, current) => PriceInput(
            currency: unit.currency,
            taxPercentage: previous.taxPercentage,
            netPrice: previous.netPrice + current.netPrice,
          ));
  return CumulatedPriceInput(
    currency: priceInput.currency,
    grossPrice: priceInput.netPrice * (1 + priceInput.taxPercentage / 100),
    taxContent: priceInput.taxPercentage,
  );
}

PriceInput getServiceFeeInput(ServiceFeePolicy? policy, PriceShown price) {
  double serviceFee = _calculateServiceFee(policy, price);

  return PriceInput(
    currency: price.currency,
    netPrice: serviceFee - _calculateServiceFeeTax(serviceFee, price),
    taxPercentage: price.tax.toDouble(),
  );
}

double _calculateServiceFee(ServiceFeePolicy? policy, PriceShown price) {
  if (policy?.type == ServiceFeeType.included ||
      policy?.type == ServiceFeeType.applicable) {
    return (price.priceSum * price.tax) / 100;
  }
  return 0;
}

double _calculateServiceFeeTax(double grossServiceFee, PriceShown price) {
  return (price.pricePerUnit / (100 + (price.tax / 100.0)));
}
