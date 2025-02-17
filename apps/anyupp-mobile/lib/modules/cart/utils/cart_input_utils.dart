import '/graphql/generated/crud-api.graphql.dart';
import '/models.dart';
import '/modules/cart/cart.dart';
import '/modules/cart/utils/cart_to_order_calculations.dart';

CreateOrderFromCartArguments createOrderFromCartArguments(
  Unit unit,
  Cart cart,
) {
  // var map = cart.toJson();
  // map['sumPriceShown'] = {
  //   'currency': unit.currency,
  //   'pricePerUnit': 0.0,
  //   'priceSum': 0.0,
  //   'tax': 0,
  //   'taxSum': 0.0,
  // };

  // Order order = updateOrderPrices(Order.fromJson(map));
  return CreateOrderFromCartArguments(
    order: CreateOrderInput(
      unitId: cart.unitId,
      userId: cart.userId,
      orderPolicy: cart.orderPolicy,
      archived: false,
      hasRated: false,
      place: cart.place != null
          ? PlaceInput(
              seat: cart.place!.seat ?? EMPTY_SEAT,
              table: cart.place!.table ?? EMPTY_TABLE,
            )
          : null,
      serviceFee: cart.serviceFee != null
          ? CumulatedPriceInput(
              currency: cart.serviceFee!.currency,
              grossPrice: cart.serviceFee!.grossPrice,
              taxContent: cart.serviceFee!.taxContent,
            )
          : null,
      sumPriceShown: PriceShownInput(
        currency: unit.currency,
        priceSum: cart.totalPrice,
        pricePerUnit: 0,
        tax: 0,
        taxSum: 0,
      ),
      packagingFeeTaxPercentage: unit.packagingTaxPercentage,
      packagingSum: _priceToInput(cart.packagingSum),
      paymentMode: cart.paymentMode != null
          ? PaymentModeInput(
              method: cart.paymentMode!.method,
              type: cart.paymentMode!.type,
              caption: cart.paymentMode!.caption,
            )
          : null,
      serviceFeePolicy: unit.serviceFeePolicy != null
          ? ServiceFeePolicyInput.fromJson(unit.serviceFeePolicy!.toJson())
          : null,
      soldOutVisibilityPolicy: unit.soldOutVisibilityPolicy,
      tipPolicy: unit.tipPolicy != null
          ? TipPolicyInput.fromJson(unit.tipPolicy!.toJson())
          : null,
      version: 1,
      ratingPolicies: unit.ratingPolicies
          ?.map((e) => RatingPolicyInput.fromJson(e.toJson()))
          .toList(),
      items: cart.items
          .map(
            (item) => OrderItemInput(
              productId: item.productId,
              configSets: item.configSets
                  ?.map((cs) => OrderItemConfigSetInput(
                        productSetId: cs.productSetId,
                        name: _localizedItemInput(cs.name)!,
                        type: cs.type,
                        items: cs.items
                            .map((comp) => OrderItemConfigComponentInput(
                                  name: _localizedItemInput(comp.name)!,
                                  externalId: comp.externalId,
                                  productComponentId: comp.productComponentId,
                                  price: comp.price,
                                  netPackagingFee: comp.netPackagingFee,
                                  allergens: comp.allergens,
                                ))
                            .toList(),
                      ))
                  .toList(),
              productName: _localizedItemInput(item.productName)!,
              quantity: item.quantity,
              variantId: item.variantId,
              variantName: _localizedItemInput(item.variantName)!,
              allergens: item.allergens,
              image: item.image,
              serviceFee: _priceToInput(item.serviceFee),
              netPackagingFee:
                  getTotalNetPackagingFee(unit, cart.servingMode, cart.items),
              priceShown: _priceShownToinput(item.priceShown)!,
              sumPriceShown: _priceShownToinput(item.sumPriceShown)!,
              statusLog: [
                StatusLogInput(
                  status: OrderStatus.none,
                  ts: DateTime.now().microsecondsSinceEpoch.toDouble(),
                  userId: cart.userId,
                )
              ],
            ),
          )
          .toList(),
    ),
  );
}

PriceShownInput? _priceShownToinput(PriceShown? price) {
  return price != null
      ? PriceShownInput(
          currency: price.currency,
          pricePerUnit: price.pricePerUnit,
          priceSum: price.priceSum,
          tax: price.tax,
          taxSum: price.taxSum,
        )
      : null;
}

PriceInput? _priceToInput(Price? price) {
  return price != null
      ? PriceInput(
          currency: price.currency,
          netPrice: price.netPrice,
          taxPercentage: price.taxPercentage,
        )
      : null;
}

CreateOrderFromCartArguments createOrderFromCart(Unit unit, Cart cart) {
  var serviceFee = getTotalServiceFee(unit, cart.items);

  return CreateOrderFromCartArguments(
    order: CreateOrderInput(
      unitId: cart.unitId,
      userId: cart.userId,
      orderPolicy: cart.orderPolicy,
      archived: false,
      hasRated: false,
      place: cart.place != null
          ? PlaceInput(
              seat: cart.place!.seat ?? EMPTY_SEAT,
              table: cart.place!.table ?? EMPTY_TABLE,
            )
          : null,
      serviceFee: serviceFee,
      sumPriceShown: PriceShownInput(
        currency: unit.currency,
        pricePerUnit: cart.sumPriceShown!.pricePerUnit,
        tax: cart.sumPriceShown!.tax,
        priceSum: cart.sumPriceShown!.priceSum,
        taxSum: cart.sumPriceShown!.taxSum,
      ),
      packagingFeeTaxPercentage: unit.packagingTaxPercentage,
      packagingSum: cart.packagingSum != null
          ? PriceInput(
              currency: unit.currency,
              netPrice: cart.packagingSum!.netPrice,
              taxPercentage: cart.packagingSum!.taxPercentage,
            )
          : null,
      paymentMode: cart.paymentMode != null
          ? PaymentModeInput(
              method: cart.paymentMode!.method,
              type: cart.paymentMode!.type,
              caption: cart.paymentMode!.caption,
            )
          : null,
      serviceFeePolicy: unit.serviceFeePolicy != null
          ? ServiceFeePolicyInput.fromJson(unit.serviceFeePolicy!.toJson())
          : null,
      soldOutVisibilityPolicy: unit.soldOutVisibilityPolicy,
      tipPolicy: unit.tipPolicy != null
          ? TipPolicyInput.fromJson(unit.tipPolicy!.toJson())
          : null,
      version: 1,
      ratingPolicies: unit.ratingPolicies
          ?.map((e) => RatingPolicyInput.fromJson(e.toJson()))
          .toList(),
      items: cart.items
          .map(
            (item) => OrderItemInput(
              productId: item.productId,
              configSets: item.configSets
                  ?.map((i) => OrderItemConfigSetInput(
                        name: _localizedItemInput(i.name)!,
                        productSetId: i.productSetId,
                        type: i.type,
                        items: i.items
                            .map((i) => OrderItemConfigComponentInput(
                                  name: _localizedItemInput(i.name)!,
                                  price: i.price,
                                  productComponentId: i.productComponentId,
                                  externalId: i.externalId,
                                  netPackagingFee: i.netPackagingFee,
                                  allergens: i.allergens,
                                ))
                            .toList(),
                      ))
                  .toList(),
              productName: _localizedItemInput(item.productName)!,
              quantity: item.quantity,
              variantId: item.variantId,
              variantName: _localizedItemInput(item.variantName)!,
              allergens: item.allergens,
              image: item.image,
              serviceFee:
                  getServiceFeeInput(unit.serviceFeePolicy, item.priceShown),
              netPackagingFee:
                  getTotalNetPackagingFee(unit, cart.servingMode, cart.items),
              priceShown: PriceShownInput(
                currency: item.priceShown.currency,
                pricePerUnit: item.priceShown.pricePerUnit,
                priceSum: item.priceShown.priceSum,
                tax: item.priceShown.tax,
                taxSum: item.priceShown.taxSum,
              ),
              sumPriceShown: PriceShownInput(
                currency: item.sumPriceShown.currency,
                pricePerUnit: item.sumPriceShown.pricePerUnit,
                priceSum: item.sumPriceShown.priceSum,
                tax: item.sumPriceShown.tax,
                taxSum: item.sumPriceShown.taxSum,
              ),
              statusLog: [
                StatusLogInput(
                  status: OrderStatus.none,
                  ts: DateTime.now().microsecondsSinceEpoch.toDouble(),
                  userId: cart.userId,
                )
              ],
            ),
          )
          .toList(),
    ),
  );
}

LocalizedItemInput? _localizedItemInput(LocalizedItem? item) {
  if (item != null) {
    return LocalizedItemInput(
      hu: item.hu,
      de: item.de,
      en: item.en,
    );
  }
  return null;
}
