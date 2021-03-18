import 'package:cloud_functions/cloud_functions.dart';
import 'package:fa_prev/shared/providers/function_provider_interface.dart';
import 'package:flutter/services.dart';
import 'dart:developer';

class FirebaseFunctionsProvider implements IFunctionProvider {
  final CloudFunctions _cloudFunctions;

  FirebaseFunctionsProvider(this._cloudFunctions);

  /// Utility function to call a Firebase Function
  @override
  Future<T> call<T>(String name, Map params) async {
    name = '$name';
    log('FirebaseFunctionsProvider._call, $name, $params');
    final callable = _cloudFunctions.getHttpsCallable(
      functionName: name,
    );
    try {
      final response = await callable.call(params);
      log('FirebaseFunctionsProvider.response, $response');
      return response.data['result'];
    } on CloudFunctionsException catch (e) {
      log('CloudFunctionsException: ${e.message}');
      log(e.toString());
      return null;
    } on PlatformException catch (e) {
      log('PlatformException: ${e.message}');
      log(e.toString());
       return null;
       
      // } catch (e) {
      //   log(e.message);
      //   log(e.toString());
      //   rethrow;
    }
  }


  Future<T> createOrderFromCart<T>(Map params) async {
    return call('createOrderFromCart', params);
  }

  Future<bool> userPaymentIntentionSignal(String chainId, String unitId) async {
    print('********** userPaymentIntentionSignal().chain=$chainId, unit=$unitId');
    Map<String, dynamic> params = {
      'chainId': chainId,
      'unitId': unitId,
    };
    await call('userPaymentIntentionSignal', params);
    return true;
  }
}
