import 'package:fa_prev/modules/payment/simplepay/simplepay.dart';

abstract class ISimplePayProvider {
  Future<SimplePayStartResponse> startSimplePayPayment(String chainId, String unitId, String orderId);
  Future<SimplePayPaymentResult> collectPaymentTransactionStatus(String transactionId);
}
