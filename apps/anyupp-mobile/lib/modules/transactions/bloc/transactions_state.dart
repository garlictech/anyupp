part of 'transactions_bloc.dart';

abstract class TransactionsState extends Equatable {
  const TransactionsState();

  @override
  List<Object> get props => [];
}

class TransactionsInitial extends TransactionsState{}

class TransactionsLoadedState extends TransactionsState {
  final List<TransactionItem> items;
  TransactionsLoadedState({this.items});

  @override
  List<Object> get props => [items];
}
