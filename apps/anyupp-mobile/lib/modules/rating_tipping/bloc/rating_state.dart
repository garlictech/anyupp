part of 'rating_bloc.dart';

abstract class RatingState extends Equatable {
  const RatingState();

  @override
  List<Object> get props => [];
}

class RatingInitial extends RatingState {}

class RatingLoading extends RatingState {}

class RatingSuccess extends RatingState {}

class RatingFailed extends RatingState {
  final String code;
  final String message;

  const RatingFailed(this.code, this.message);

  @override
  List<Object> get props => [code, message];
}

class TipFailed extends RatingState {
  final String code;
  final String message;
  TipFailed(this.code, this.message);
}
