import 'dart:async';

import 'package:bloc/bloc.dart';
import '/core/core.dart';
import '/modules/transactions/transactions.dart';
import '/shared/exception.dart';

class TransactionsBloc extends Bloc<TransactionsEvent, TransactionsState> {
  final TransactionsRepository _transactionsRepository;

  TransactionsBloc(this._transactionsRepository)
      : super(TransactionsInitial()) {
    on<Loading>((event, emit) => emit(LoadingState()));
    on<LoadTransactions>(_onLoadTransactions);
  }

  FutureOr<void> _onLoadTransactions(
      LoadTransactions event, Emitter<TransactionsState> emit) async {
    try {
      emit(LoadingState());
      var response = await _transactionsRepository.getTransactions();
      emit(TransactionsLoadedState(response: response));
    } on Exception catch (e) {
      log.e('TransactionsBloc.exception=$e');
      getIt<ExceptionBloc>().add(ShowException(
        TransactionException(
            code: TransactionException.CODE, message: e.toString()),
      ));
    }
  }
}
