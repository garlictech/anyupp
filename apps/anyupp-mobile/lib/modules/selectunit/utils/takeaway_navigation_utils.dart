import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/cart/cart.dart';
import 'package:fa_prev/modules/screens.dart';
import 'package:fa_prev/modules/takeaway/takeaway.dart';
import 'package:fa_prev/shared/nav.dart';
import 'package:fa_prev/shared/utils/place_preferences.dart';
import 'package:fa_prev/shared/widgets.dart';
import 'package:flutter/material.dart';
import 'package:fa_prev/graphql/generated/crud-api.dart';

Future<int?> selectUnitAndGoToMenuScreen(BuildContext context, GeoUnit unit,
    {bool dismissable = true,
    bool deletePlace = false,
    bool useTheme = true}) async {
  if (deletePlace) {
    await clearPlacePref(unit.id);
  }
  log.d('selectUnitAndGoToMenuScreen=${unit.id}');
  log.d(
      'selectUnitAndGoToMenuScreen.servingModes=${unit.supportedServingModes}');

  Cart? cart = await getIt<CartRepository>().getCurrentCart(unit.id);
  log.d('selectUnitAndGoToMenuScreen().cart=${cart?.id}');
  log.d('selectUnitAndGoToMenuScreen().servingMode=${cart?.servingMode}');

  if (unit.supportedServingModes.length == 1) {
    _selectServingModeAndGo(
      cart,
      unit.supportedServingModes[0],
      unit,
      deletePlace: deletePlace,
    );
    return null;
  }

  int? servingModeIndex;
  if (cart?.servingMode != null) {
    if (cart!.servingMode == ServingMode.takeAway) {
      servingModeIndex = 1;
    } else {
      servingModeIndex = 0;
    }
  }

  var response = await showSelectServingModeSheetWithDeleteConfirm(
    context,
    cart,
    cart?.servingMode ?? ServingMode.inPlace,
    initialPosition: servingModeIndex,
    dismissable: dismissable,
    useTheme: useTheme,
  );
  log.d('_selectUnitAndGoToMenuScreen().selectedMethodPos=$response');
  if (response != null) {
    _selectServingModeAndGo(
      response.cart,
      response.selectedMode == 0 ? ServingMode.inPlace : ServingMode.takeAway,
      unit,
      deletePlace: deletePlace,
      cartDeleted: cart != null && response.cart == null,
    );
    return response.selectedMode;
  } else {
    getIt<TakeAwayBloc>().add(ResetServingMode());
  }
  return response?.selectedMode;
}

void _selectServingModeAndGo(
  Cart? cart,
  ServingMode servingMode,
  GeoUnit unit, {
  bool deletePlace = false,
  bool cartDeleted = false,
}) async {
  // log.d('_selectServingModeAndGo().cart=${cart?.id}');
  if (cart != null) {
    getIt<CartBloc>().add(SetCartServingMode(unit.id, servingMode));
    if (deletePlace == true) {
      getIt<CartBloc>().add(ClearPlaceInCart(unit));
    }
  }

  getIt<UnitSelectBloc>().add(SelectUnit(unit));
  getIt<TakeAwayBloc>().add(SetServingMode(servingMode));
  if (cartDeleted) {
    await Future.delayed(Duration(seconds: 1));
  }
  Nav.reset(MainNavigation());
}
