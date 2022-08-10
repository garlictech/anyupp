import '/core/core.dart';
import '/models.dart';
import '/modules/cart/cart.dart';
import '/modules/screens.dart';
import '/modules/takeaway/takeaway.dart';
import '/shared/nav.dart';
import '/shared/utils/place_preferences.dart';
import '/shared/utils/unit_utils.dart';
import '/shared/widgets.dart';
import 'package:flutter/material.dart';
import '/graphql/generated/crud-api.dart';

Future<ServingMode?> selectUnitAndGoToMenuScreen(
  BuildContext context,
  Unit unit, {
  bool dismissable = true,
  bool deletePlace = false,
  bool useTheme = true,
  bool showSelectServingMode = false,
}) async {
  if (deletePlace) {
    await clearPlacePref(unit.id);
  }
  log.d('selectUnitAndGoToMenuScreen=${unit.id}');
  log.d(
      'selectUnitAndGoToMenuScreen.servingModes=${unit.supportedServingModes}');

  Cart? cart = await getIt<CartRepository>().getCurrentCart(unit.id);
  log.d('selectUnitAndGoToMenuScreen().cart=${cart?.id}');
  log.d('selectUnitAndGoToMenuScreen().cart.servingMode=${cart?.servingMode}');
  log.d('selectUnitAndGoToMenuScreen().currentServingMode=$currentServingMode');

  if (!showSelectServingMode) {
    selectServingModeAndGo(
      cart,
      currentServingMode,
      unit,
      deletePlace: deletePlace,
    );
    return null;
  }

  if (unit.supportedServingModes.length == 1) {
    selectServingModeAndGo(
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
    selectServingModeAndGo(
      response.cart,
      response.selectedMode ?? ServingMode.inPlace,
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

void selectServingModeAndGo(
  Cart? cart,
  ServingMode servingMode,
  Unit unit, {
  bool deletePlace = false,
  bool cartDeleted = false,
}) async {
  log.d('_selectServingModeAndGo().cart=${cart?.id}, servingMode=$servingMode');
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
  Nav.to(MenuScreen());
}
