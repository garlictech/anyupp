import '/core/core.dart';
import '/models.dart';
import '/graphql/generated/crud-api.dart';
import '/modules/cart/cart.dart';
import '/modules/takeaway/takeaway.dart';

import 'place_preferences.dart';

Unit? get currentUnit {
  var state = getIt<UnitSelectBloc>().state;
  if (state is UnitSelected) {
    return state.unit;
  }
  return null;
}

Cart? get currentCart => getIt.get<CartRepository>().cart;

Future<Place?> get currentPlace async =>
    (currentUnit != null ? await getPlacePref(currentUnit!.id) : null);

ServingMode get currentServingMode {
  var state = getIt<TakeAwayBloc>().state;
  if (state is ServingModeSelectedState) {
    return state.servingMode;
  }
  return ServingMode.inPlace;
}

double get serviceFeeMul =>
    // 1.0 + ((currentUnit?.serviceFeePolicy?.percentage ?? 0.0) / 100.0);
    (currentUnit?.serviceFeePolicy?.type == ServiceFeeType.included &&
            takeAwayMode == ServingMode.inPlace)
        ? 1.0 + (currentUnit!.serviceFeePolicy!.percentage / 100.0)
        : 1.0;

double serviceFeeMulOrder(ServiceFeePolicy? serviceFeePolicy) =>
    // 1.0 + ((currentUnit?.serviceFeePolicy?.percentage ?? 0.0) / 100.0);
    (serviceFeePolicy?.type == ServiceFeeType.included &&
            takeAwayMode == ServingMode.inPlace)
        ? 1.0 + ((serviceFeePolicy?.percentage ?? 0) / 100.0)
        : 1.0;
