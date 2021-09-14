import 'dart:async';

import 'package:bloc/bloc.dart';
import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/modules/transactions/repository/transactions_repository.dart';
import 'package:fa_prev/shared/exception.dart';

import '../transactions.dart';
import 'transactions_event.dart';
import 'transactions_state.dart';

class TransactionsBloc extends Bloc<TransactionsEvent, TransactionsState> {
  final TransactionsRepository _transactionsRepository;
  TransactionsBloc(this._transactionsRepository) : super(TransactionsInitial());

  @override
  Stream<TransactionsState> mapEventToState(
    TransactionsEvent event,
  ) async* {
    try {
      if (event is Loading) {
        yield LoadingState();
      }
      if (event is LoadTransactions) {
        yield LoadingState();
        var response = await _transactionsRepository.getTransactions();
        yield TransactionsLoadedState(response: response);
      }
    } on Exception catch (e) {
      print('TransactionsBloc.exception=$e');
      getIt<ExceptionBloc>().add(ShowException(
        TransactionException(code: TransactionException.CODE, message: e.toString()),
      ));
    }
  }
}
