import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/cart/cart.dart';
import 'package:fa_prev/modules/takeaway/takeaway.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/shared/nav.dart';
import 'package:fa_prev/shared/widgets.dart';
import 'package:flutter/material.dart';
import 'package:fa_prev/graphql/generated/crud-api.dart';

Future<int?> showSelectServingModeSheet(BuildContext context,
    {int initialPosition = 0,
    bool useTheme = true,
    bool dismissable = true}) async {
  final ThemeChainData theme = getIt<ThemeBloc>().state.theme;

  return await showModalBottomSheet(
    context: context,
    isDismissible: dismissable,
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.only(
        topLeft: Radius.circular(16.0),
        topRight: Radius.circular(16.0),
      ),
    ),
    enableDrag: true,
    // isScrollControlled: true,
    elevation: 4.0,
    backgroundColor: useTheme ? theme.secondary0 : Colors.white,
    builder: (context) {
      return SelectServingModeWidget(
          initialPosition: initialPosition,
          useTheme: useTheme,
          onSelected: (pos) {
            print('showSelectServingModeSheet.pos=$pos');
          });
    },
  );
}

Future<int?> showSelectServingModeSheetWithDeleteConfirm(
    BuildContext context, Cart? cart, ServingMode current,
    {int initialPosition = 0,
    bool useTheme = true,
    bool dismissable = true,
    bool pop = false}) async {
  final ThemeChainData theme = getIt<ThemeBloc>().state.theme;
  print(
      'showSelectServingModeSheetWithDeleteConfirm().cart=${cart?.id}, current=$current');

  int? selectedMethodPos = await showModalBottomSheet(
    context: context,
    isDismissible: dismissable,
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.only(
        topLeft: Radius.circular(16.0),
        topRight: Radius.circular(16.0),
      ),
    ),
    enableDrag: true,
    // isScrollControlled: true,
    elevation: 4.0,
    backgroundColor: useTheme ? theme.secondary0 : Colors.white,
    builder: (context) {
      return SelectServingModeWidget(
          initialPosition: initialPosition,
          useTheme: useTheme,
          onSelected: (pos) {
            print('showSelectServingModeSheet.pos=$pos');
          });
    },
  );
  if (selectedMethodPos == null) {
    return null;
  }

  ServingMode mode =
      selectedMethodPos == 0 ? ServingMode.inPlace : ServingMode.takeAway;

  if (cart != null &&
      (current == ServingMode.inPlace ? 0 : 1) != selectedMethodPos) {
    bool? deleted = await _showdeleteCartConfirmation(context, mode);
    print('showSelectServingModeSheetWithDeleteConfirm.deleted=$deleted');
    if (deleted == true && pop) {
      Nav.pop();
    }
    if (deleted != true) {
      return null;
    }
    return selectedMethodPos;
  }

  if ((current == ServingMode.inPlace ? 0 : 1) != selectedMethodPos) {
    print('showSelectServingModeSheetWithDeleteConfirm.mode=$mode');
    getIt<TakeAwayBloc>().add(SetServingMode(mode));
  }
  return selectedMethodPos;
}

Future<bool?> _showdeleteCartConfirmation(
    BuildContext context, ServingMode servingMode) async {
  print('_showdeleteCartConfirmation().start().mode=$servingMode');
  final ThemeChainData theme = getIt<ThemeBloc>().state.theme;

  return showDialog<bool>(
    context: context,
    builder: (BuildContext context) {
      return AlertDialog(
        title: Text(
          transEx(
            context,
            servingMode == ServingMode.takeAway
                ? 'servingModeSheet.dialog.title.inplace'
                : 'servingModeSheet.dialog.title.takeaway',
          ),
          style: Fonts.satoshi(
            fontSize: 17,
            fontWeight: FontWeight.w600,
            color: theme.secondary,
          ),
        ),
        content: Text(
          transEx(context, 'servingModeSheet.dialog.description'),
          style: Fonts.satoshi(
            fontSize: 13,
            fontWeight: FontWeight.w400,
            color: theme.secondary,
          ),
        ),
        actions: [
          TextButton(
            child: Text(
              transEx(context, 'servingModeSheet.dialog.cancel'),
              style: Fonts.satoshi(
                fontSize: 17,
                fontWeight: FontWeight.w400,
                color: theme.secondary,
              ),
            ),
            onPressed: () {
              Nav.pop(false);
            },
          ),
          TextButton(
            child: Text(
              transEx(context, 'servingModeSheet.dialog.ok'),
              style: Fonts.satoshi(
                fontSize: 17,
                fontWeight: FontWeight.w600,
                color: theme.highlight,
              ),
            ),
            onPressed: () async {
              Nav.pop(true);
              getIt<CartBloc>().add(ClearCartAction());
              getIt<TakeAwayBloc>().add(SetServingMode(servingMode));
            },
          ),
        ],
      );
    },
  );
}
