import 'package:fa_prev/models/core/parsers.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:fa_prev/graphql/generated/crud-api.dart';

Future<bool> setOrderStatusPref(String orderId, OrderStatus status) async {
  //log.d('**** setOrderStatusPref["$orderId"]=$status');
  SharedPreferences prefs = await SharedPreferences.getInstance();
  return prefs.setString('ORDERS_$orderId', enumToString(status)!);
}

Future<OrderStatus?> getOrderStatusPref(String orderId) async {
  SharedPreferences prefs = await SharedPreferences.getInstance();
  String? status = prefs.getString('ORDERS_$orderId');
  //log.d('**** getOrderStatusPref["$orderId"]=$status');
  return enumFromStringNull(status, OrderStatus.values);
}
