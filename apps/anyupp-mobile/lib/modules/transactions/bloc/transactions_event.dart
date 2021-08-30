import 'package:equatable/equatable.dart';

abstract class TransactionsEvent extends Equatable {
  const TransactionsEvent();

  @override
  List<Object?> get props => [];
}

class LoadTransactions extends TransactionsEvent {
  const LoadTransactions();
}

class Loading extends TransactionsEvent {
  const Loading();
}
