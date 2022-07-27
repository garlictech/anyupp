import 'package:equatable/equatable.dart';
import '/graphql/generated/crud-api.dart';

class PaymentMethodExt extends Equatable {
  final PaymentMethod method;
  final String? cardId;

  const PaymentMethodExt({required this.method, this.cardId});

  @override
  List<Object?> get props => [method, cardId];
}
