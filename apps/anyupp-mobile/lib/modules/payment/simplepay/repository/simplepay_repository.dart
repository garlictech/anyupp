import 'package:fa_prev/models.dart';
import 'package:rxdart/rxdart.dart';

import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/modules/payment/simplepay/providers/simplepay_provider_interface.dart';
import 'package:fa_prev/modules/payment/simplepay/simplepay.dart';

class SimplePayRepository {
  final ISimplePayProvider _functionsProvider;

  SimplePayRepository(this._functionsProvider);

  Future<SimplePayStartResponse> startPayment(GeoUnit unit, Order order) async {
    print('***** startPayment(${unit.chainId}, ${unit.unitId}, ${order.id})');
    return this._functionsProvider.startSimplePayPayment(unit.chainId, unit.unitId, order.id);
  }

  Stream<SimplePayPaymentResult> collectPaymentTransactionStatus(String transactionId) {
    return Rx.retry(() => this._functionsProvider.collectPaymentTransactionStatus(transactionId).asStream(), 3);
  }
}
