import '/models/Price.dart';

extension PriceExtension on Price {
  double get totalPrice => netPrice * (1.0 + (taxPercentage / 100.0));
}
