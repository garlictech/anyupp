part of 'rating_bloc.dart';

abstract class RatingEvent extends Equatable {
  const RatingEvent();

  @override
  List<Object> get props => [];
}

class ResetRating extends RatingEvent {}

class RateAndTipOrder extends RatingEvent {
  final String orderId;
  final OrderRating rating;
  final TipType? tipType;
  final double? tipValue;

  const RateAndTipOrder({
    required this.orderId,
    required this.rating,
    this.tipType,
    this.tipValue,
  });

  @override
  List<Object> get props => [orderId, rating];
}

class RateOrder extends RatingEvent {
  final String orderId;
  final OrderRating rating;

  const RateOrder({
    required this.orderId,
    required this.rating,
  });

  @override
  List<Object> get props => [orderId, rating];
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

class InvalidTipAmount extends RatingEvent {
  final String title;
  final String description;
  const InvalidTipAmount(this.title, this.description);
  @override
  List<Object> get props => [title, description];
}
