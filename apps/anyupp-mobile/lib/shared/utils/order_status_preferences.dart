import 'package:shared_preferences/shared_preferences.dart';

Future<bool> setOrderStatusPref(String orderId, String status) async {
  //print('**** setOrderStatusPref["$orderId"]=$status');
  SharedPreferences prefs = await SharedPreferences.getInstance();
  return prefs.setString('ORDERS_$orderId', status);
}

Future<String?> getOrderStatusPref(String orderId) async {
  SharedPreferences prefs = await SharedPreferences.getInstance();
  String? status = prefs.getString('ORDERS_$orderId');
  //print('**** getOrderStatusPref["$orderId"]=$status');
  return status;
}
