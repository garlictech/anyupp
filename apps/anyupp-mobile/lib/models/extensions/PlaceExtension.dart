import 'package:fa_prev/models/Place.dart';
import 'package:fa_prev/modules/cart/models/cart_constants.dart';

extension PlaceExtension on Place {
  bool get isEmpty =>
      (table == null || table == EMPTY_TABLE) &&
      (seat == null || seat == EMPTY_SEAT);

  bool get isNotEmpty => !isEmpty;
}
