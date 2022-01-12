part of 'rating_bloc.dart';

abstract class RatingEvent extends Equatable {
  const RatingEvent();

  @override
  List<Object> get props => [];
}

class ResetRating extends RatingEvent {}

class RateAndTipOrder extends RatingEvent {
  final String orderId;
  final int? rating;
  final TipType? tipType;
  final double? tipValue;

  const RateAndTipOrder({
    required this.orderId,
    this.rating,
    this.tipType,
    this.tipValue,
  });

  @override
  List<Object> get props => [orderId];
}

class RateOrder extends RatingEvent {
  final String orderId;
  final int? rating;

  const RateOrder({
    required this.orderId,
    this.rating,
  });

  @override
  List<Object> get props => [orderId];
}

class TipOrder extends RatingEvent {
  final String orderId;
  final TipType? tipType;
  final double? tipValue;

  const TipOrder({
    required this.orderId,
    this.tipType,
    this.tipValue,
  });

  @override
  List<Object> get props => [orderId];
}
