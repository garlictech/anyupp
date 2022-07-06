import 'package:fa_prev/models.dart';

void debugOrder(Order order) {
  print('debugOrder[${order.id}:');
  print('\t------------- Policies ------------------');
  print('\torderPolicy=${order.orderPolicy}');
  print('\torderMode=${order.orderMode}');
  print('\tpaymentMode=${order.paymentMode}');
  print('\tserviceFeePolicy=${order.serviceFeePolicy}');
  print('\tsoldOutVisibilityPolicy=${order.soldOutVisibilityPolicy}');
  print('\ttipPolicy=${order.tipPolicy}');
  print('\tratingPolicies=${order.ratingPolicies}');

  print('\t------------- Items ------------------');
  print('\titems:');
  order.items.forEach((item) => debugOrderItem(item, '\t'));

  print('\t------------- Calculated values ------------------');
  print('\tsumPriceShown=${order.sumPriceShown}');
  print('\tpackagingSum=${order.packagingSum}');
  print('\tserviceFee=${order.serviceFee}');
}

void debugOrderItem(OrderItem item, [String tab = '']) {
  print('${tab}Item[${item.productName}]');
  print('${tab}\t netPackagingFee=${item.netPackagingFee}');
  print('${tab}\t quantity=${item.quantity}');
  print('${tab}\t serviceFee=${item.serviceFee}');
  print('${tab}\t priceShown=${item.priceShown}');
  print('${tab}\t sumPriceShown=${item.sumPriceShown}');
  item.configSets
      ?.forEach((configSet) => debugConfigSet(configSet, '${tab}\t'));
}

void debugConfigSet(OrderItemConfigSet set, [String tab = '']) {
  print('${tab}ConfigSet=${set.name.hu}, type=${set.type}');
  for (int i = 0; i < set.items.length; i++) {
    var item = set.items[i];
    print('${tab}\t name[$i]=${item.name.hu}');
    print('${tab}\t netPackagingFee[$i]=${item.netPackagingFee}');
    print('${tab}\t price[$i]=${item.price}');
  }
}
