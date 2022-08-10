import 'package:anyupp/models.dart';
import 'package:anyupp/core/logger.dart';

void debugOrder(Order order) {
  log.d('debugOrder[${order.id}:');
  log.d('\t------------- Policies ------------------');
  log.d('\torderPolicy=${order.orderPolicy}');
  log.d('\torderMode=${order.orderMode}');
  log.d('\tpaymentMode=${order.paymentMode}');
  log.d('\tserviceFeePolicy=${order.serviceFeePolicy}');
  log.d('\tsoldOutVisibilityPolicy=${order.soldOutVisibilityPolicy}');
  log.d('\ttipPolicy=${order.tipPolicy}');
  log.d('\tratingPolicies=${order.ratingPolicies}');

  log.d('\t------------- Items ------------------');
  log.d('\titems:');
  order.items.forEach((item) => debugOrderItem(item, '\t'));

  log.d('\t------------- Calculated values ------------------');
  log.d('\tsumPriceShown=${order.sumPriceShown}');
  log.d('\tpackagingSum=${order.packagingSum}');
  log.d('\tserviceFee=${order.serviceFee}');
}

void debugOrderItem(OrderItem item, [String tab = '']) {
  log.d('${tab}Item[${item.productName}]');
  log.d('${tab}\t netPackagingFee=${item.netPackagingFee}');
  log.d('${tab}\t quantity=${item.quantity}');
  log.d('${tab}\t serviceFee=${item.serviceFee}');
  log.d('${tab}\t priceShown=${item.priceShown}');
  log.d('${tab}\t sumPriceShown=${item.sumPriceShown}');
  item.configSets
      ?.forEach((configSet) => debugConfigSet(configSet, '${tab}\t'));
}

void debugConfigSet(OrderItemConfigSet set, [String tab = '']) {
  log.d('${tab}ConfigSet=${set.name.hu}, type=${set.type}');
  for (int i = 0; i < set.items.length; i++) {
    var item = set.items[i];
    log.d('${tab}\t name[$i]=${item.name.hu}');
    log.d('${tab}\t netPackagingFee[$i]=${item.netPackagingFee}');
    log.d('${tab}\t price[$i]=${item.price}');
  }
}
