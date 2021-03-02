import 'package:fa_prev/modules/payment/simplepay/model/simplepay_model.dart';

import 'simplepay_provider_interface.dart';

class AwsSimplepayProvider implements ISimplePayProvider {
  @override
  Future<SimplePayPaymentResult> collectPaymentTransactionStatus(String transactionId) {
      // TODO: implement collectPaymentTransactionStatus
      throw UnimplementedError();
    }
  
    @override
    Future<SimplePayStartResponse> startSimplePayPayment(String chainId, String unitId, String orderId) {
    // TODO: implement startSimplePayPayment
    throw UnimplementedError();
  }
}
