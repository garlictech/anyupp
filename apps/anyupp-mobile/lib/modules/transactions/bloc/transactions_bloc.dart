import 'dart:async';

import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:fa_prev/models/TransActionItem.dart';
import 'package:fa_prev/modules/transactions/repository/transactions_repository.dart';

part 'transactions_event.dart';
part 'transactions_state.dart';

class TransactionsBloc extends Bloc<TransactionsEvent, TransactionsState> {
  final TransactionsRepository _transactionsRepository;
  TransactionsBloc(this._transactionsRepository) : super(TransactionsInitial());

  @override
  Stream<TransactionsState> mapEventToState(
    TransactionsEvent event,
  ) async* {
    if (event is LoadTransactions) {
      List<TransactionItem> transActionItems = await _transactionsRepository
          .getTransactions(event.unitId);
      yield TransactionsLoadedState(items: transActionItems);
    }

    // TODO: implement mapEventToState
  }
}
