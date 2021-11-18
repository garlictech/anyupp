import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/cart/cart.dart';
import 'package:fa_prev/modules/favorites/favorites.dart';
import 'package:fa_prev/modules/screens.dart';
import 'package:fa_prev/modules/takeaway/takeaway.dart';
import 'package:fa_prev/shared/nav.dart';
import 'package:fa_prev/shared/widgets.dart';
import 'package:flutter/material.dart';
import 'package:fa_prev/graphql/generated/crud-api.dart';

void selectUnitAndGoToMenuScreen(BuildContext context, GeoUnit unit) async {
  // unit.place = Place('00', '00');

  if (unit.supportedServingModes.length == 1) {
    return _selectServingModeAndGo(unit.supportedServingModes[0], unit);
  }

  var selectedMethodPos = await showSelectServingModeSheet(context, useTheme: false);
  print('_selectUnitAndGoToMenuScreen().selectedMethodPos=$selectedMethodPos');
  if (selectedMethodPos != null) {
    return _selectServingModeAndGo(selectedMethodPos == 0 ? ServingMode.inPlace : ServingMode.takeAway, unit);
  } else {
    getIt<TakeAwayBloc>().add(ResetServingMode());
  }
}

void _selectServingModeAndGo(ServingMode servingMode, GeoUnit unit) {
  getIt<TakeAwayBloc>().add(SetServingMode(servingMode));
  getIt<CartBloc>().add(ClearPlaceInCart(unit));
  getIt<UnitSelectBloc>().add(SelectUnit(unit));
  getIt<FavoritesBloc>().add(ResetFavoritesList());
  Nav.reset(MainNavigation());
}
