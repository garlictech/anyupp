import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/cart/cart.dart';
import 'package:fa_prev/modules/screens.dart';
import 'package:fa_prev/modules/takeaway/takeaway.dart';
import 'package:fa_prev/shared/nav.dart';
import 'package:fa_prev/shared/widgets.dart';
import 'package:flutter/material.dart';
import 'package:fa_prev/graphql/generated/crud-api.dart';

Future<int?> selectUnitAndGoToMenuScreen(BuildContext context, GeoUnit unit,
    [bool dismissable = true]) async {
  // unit.place = Place('00', '00');
  print('selectUnitAndGoToMenuScreen=${unit.id}');
  print(
      'selectUnitAndGoToMenuScreen.servingModes=${unit.supportedServingModes}');

  Cart? cart = await getIt<CartRepository>().getCurrentCart(unit.id);
  print('selectUnitAndGoToMenuScreen().cart=${cart?.id}');
  print('selectUnitAndGoToMenuScreen().servingMode=${cart?.servingMode}');

  if (unit.supportedServingModes.length == 1) {
    _selectServingModeAndGo(
      cart,
      unit.supportedServingModes[0],
      unit,
    );
    return null;
  }

  var selectedMethodPos = await showSelectServingModeSheetWithDeleteConfirm(
    context,
    cart,
    cart?.servingMode ?? ServingMode.inPlace,
    initialPosition: cart?.servingMode == ServingMode.takeAway ? 1 : 0,
    dismissable: dismissable,
  );
  print('_selectUnitAndGoToMenuScreen().selectedMethodPos=$selectedMethodPos');
  if (selectedMethodPos != null) {
    _selectServingModeAndGo(
        cart,
        selectedMethodPos == 0 ? ServingMode.inPlace : ServingMode.takeAway,
        unit);
    return selectedMethodPos;
  } else {
    getIt<TakeAwayBloc>().add(ResetServingMode());
  }
  return selectedMethodPos;
}

void _selectServingModeAndGo(
    Cart? cart, ServingMode servingMode, GeoUnit unit) async {
  // if (cart != null && cart.servingMode != servingMode) {
  //   print('selectUnitAndGoToMenuScreen().DELETE CART!!!!');
  //   getIt<CartBloc>().add(ClearCartAction());
  // }
  if (cart != null) {
    getIt<CartBloc>().add(SetCartServingMode(unit.id, servingMode));
  }

  getIt<UnitSelectBloc>().add(SelectUnit(unit));
  getIt<TakeAwayBloc>().add(SetServingMode(servingMode));
  Nav.reset(MainNavigation());
}
