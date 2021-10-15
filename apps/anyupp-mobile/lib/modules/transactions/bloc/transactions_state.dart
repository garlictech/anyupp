import 'package:equatable/equatable.dart';
import 'package:fa_prev/models/Transaction.dart';
import 'package:fa_prev/shared/pagination/pagination.dart';

abstract class TransactionsState extends Equatable {
  const TransactionsState();

  @override
  List<Object?> get props => [];
}

class TransactionsInitial extends TransactionsState {}

class TransactionsLoadedState extends TransactionsState {
  final PageResponse<Transaction>? response;
  const TransactionsLoadedState({this.response});

  @override
  List<Object?> get props => [response];
}

class LoadingState extends TransactionsState {
  const LoadingState();
  @override
  List<Object?> get props => [];
}
