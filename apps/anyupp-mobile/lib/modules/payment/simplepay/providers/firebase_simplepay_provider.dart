import 'package:fa_prev/modules/payment/simplepay/simplepay.dart';
import 'package:fa_prev/shared/providers/function_provider_interface.dart';

import 'simplepay_provider_interface.dart';

class FirebaseSimplepayProvider implements ISimplePayProvider {

  final IFunctionProvider _functionProvider;

  FirebaseSimplepayProvider(this._functionProvider);

  @override
  Future<SimplePayStartResponse> startSimplePayPayment(String chainId, String unitId, String orderId) async {
    Map<String, dynamic> params = {
      'chainId': chainId,
      'unitId': unitId,
      'orderId': orderId,
    };
    Map<String, dynamic> response = Map<String, dynamic>.from(await _functionProvider.call('startSimplePayment', params));
    return SimplePayStartResponse.fromMap(response);
  }

  @override
  Future<SimplePayPaymentResult> collectPaymentTransactionStatus(String transactionId) async {
    print('********** collectPaymentTransactionStatus().transactionId=$transactionId');

    Map<String, dynamic> params = {
      'transactionId': transactionId,
    };
    Map<String, dynamic> response = Map<String, dynamic>.from(await _functionProvider.call('simplePayCollectTransactionStatus', params));
    return SimplePayPaymentResult.fromMap(response);
  }
}
