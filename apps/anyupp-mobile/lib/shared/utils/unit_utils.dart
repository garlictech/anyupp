import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/graphql/generated/crud-api.dart';
import 'package:fa_prev/modules/cart/cart.dart';
import 'package:fa_prev/modules/takeaway/takeaway.dart';

GeoUnit? get currentUnit {
  var state = getIt<UnitSelectBloc>().state;
  if (state is UnitSelected) {
    return state.unit;
  }
  return null;
}

Cart? get currentCart => getIt.get<CartRepository>().cart;

ServingMode? get currentServingMode {
  var state = getIt<TakeAwayBloc>().state;
  if (state is ServingModeSelectedState) {
    return state.servingMode;
  }
  return null;
}

double get serviceFeeMul =>
    // 1.0 + ((currentUnit?.serviceFeePolicy?.percentage ?? 0.0) / 100.0);
    (currentUnit?.serviceFeePolicy?.type == ServiceFeeType.included &&
            currentServingMode != ServingMode.takeAway)
        ? 1.0 + (currentUnit!.serviceFeePolicy!.percentage / 100.0)
        : 1.0;
