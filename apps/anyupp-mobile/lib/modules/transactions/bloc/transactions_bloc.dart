import 'dart:async';

import 'package:bloc/bloc.dart';
import 'package:fa_prev/modules/transactions/repository/transactions_repository.dart';

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
    if (event is Loading) {
      yield LoadingState();
    }
    if (event is LoadTransactions) {
      dynamic transActionItems = await _transactionsRepository.getTransactions();
      yield TransactionsLoadedState(items: transActionItems);
    }
  }
}
