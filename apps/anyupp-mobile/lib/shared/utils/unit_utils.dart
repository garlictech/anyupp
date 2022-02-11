import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/models/GeoUnit.dart';
import 'package:fa_prev/graphql/generated/crud-api.dart';

GeoUnit? get currentUnit {
  var state = getIt<UnitSelectBloc>().state;
  if (state is UnitSelected) {
    return state.unit;
  }
  return null;
}

double get serviceFeeMul =>
    // 1.0 + ((currentUnit?.serviceFeePolicy?.percentage ?? 0.0) / 100.0);
    currentUnit?.serviceFeePolicy?.type == ServiceFeeType.included
        ? 1.0 + (currentUnit!.serviceFeePolicy!.percentage / 100.0)
        : 1.0;
