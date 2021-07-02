import 'dart:async';
import 'package:catcher/catcher.dart';
import 'package:fa_prev/app-config.dart';
import 'package:fa_prev/core/core.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import 'package:rxdart/rxdart.dart';
import 'package:fa_prev/shared/exception.dart';

import 'package:fa_prev/modules/payment/simplepay/simplepay.dart';

class SimplePayBloc extends Bloc<SimplePayEvent, SimplePayState> {
  final SimplePayRepository _repository;

  SimplePayBloc(this._repository) : super(SimplePayInitialState());

  @override
  Stream<SimplePayState> mapEventToState(SimplePayEvent event) async* {
    if (event is StartSimplePayPayment) {
      yield* _mapStartPaymentToState(event);
    }

    

    if (event is CollectSimplePayTransactionStatus) {
      yield* _mapCollectSimplePayTransactionStatusToState(event).onErrorReturnWith((dynamic error) {
        Catcher.reportCheckedError(error, error.stackTrace);

        // Show error dialog (with the transactionId in it) to the user in case we don't know the transaction's actual state
        getIt<ExceptionBloc>().add(ShowException(SimplePayException(
            code: SimplePayException.ERROR_SIMPLE_PAY_TRANSACTION_STATUS_UNKNOWN,
            message: null,
            details: AppConfig.Stage == 'dev' ? [event.transactionId] : null)));
        return SimplePayError();
      });
    }
  }

  Stream<SimplePayState> _mapCollectSimplePayTransactionStatusToState(CollectSimplePayTransactionStatus event) {
    return _repository
        .collectPaymentTransactionStatus(event.transactionId)
        .take(1)
        .map((event) => SimplePayPaymentResultState(event));
  }

  Stream<SimplePayState> _mapStartPaymentToState(StartSimplePayPayment event) async* {
    try {
      yield SimplePayLoading();
      SimplePayStartResponse response = await _repository.startPayment(event.unit, event.order);
      yield SimplePayWebStarted(response.paymentUrl, response.transactionId);
    } on PlatformException catch (e) {
      Catcher.reportCheckedError(e, e.stacktrace);
      getIt<ExceptionBloc>().add(ShowException(SimplePayException.fromPlatformException(e)));
      yield SimplePayInitialState();
    }
  }
}
