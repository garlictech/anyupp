import 'package:equatable/equatable.dart';

class StripePaymentMethod extends Equatable {
  final String id;

  final String brand;

  final String last4;

  final int expMonth;

  final int expYear;

  const StripePaymentMethod({this.id, this.brand, this.last4, this.expMonth, this.expYear});

  @override
  List<Object> get props => [id, brand, last4, expMonth, expYear];

  // factory StripePaymentMethod.fromStripe(GetCustomerStripeCards$Query$StripeCard stripeCard) {
  //   return StripePaymentMethod(
  //     id: stripeCard.id,
  //     brand: stripeCard.brand.toString().split('.').last,
  //     last4: stripeCard.last4,
  //     expYear: stripeCard.exp_year,
  //     expMonth: stripeCard.exp_month,
  //   );
  // }
}

// class StripeCard {
//   String id;

//   String last4;

//   int exp_month;

//   int exp_year;
// }
