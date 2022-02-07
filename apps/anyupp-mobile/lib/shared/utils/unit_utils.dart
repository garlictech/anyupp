import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/models/GeoUnit.dart';

GeoUnit? get currentUnit {
  var state = getIt<UnitSelectBloc>().state;
  if (state is UnitSelected) {
    return state.unit;
  }
  return null;
}
