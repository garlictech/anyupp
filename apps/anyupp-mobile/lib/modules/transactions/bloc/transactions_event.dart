import 'package:equatable/equatable.dart';

abstract class TransactionsEvent extends Equatable {
  const TransactionsEvent();

  @override
  List<Object?> get props => [];
}

class LoadTransactions extends TransactionsEvent {
  final String? nextToken;
  const LoadTransactions({this.nextToken});
  @override
  List<Object?> get props => [nextToken];
}

class Loading extends TransactionsEvent {
  const Loading();
}
