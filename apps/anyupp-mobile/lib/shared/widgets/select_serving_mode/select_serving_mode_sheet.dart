import '/core/core.dart';
import '/models.dart';
import '/modules/cart/cart.dart';
import '/modules/takeaway/takeaway.dart';
import '/shared/locale.dart';
import '/shared/nav.dart';
import '/shared/widgets.dart';
import '/shared/widgets/platform_alert_dialog.dart';
import 'package:flutter/material.dart';
import '/graphql/generated/crud-api.dart';

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
            log.d('showSelectServingModeSheet.pos=$pos');
          });
    },
  );
}

class SelectServiceModeResult {
  final ServingMode? selectedMode;
  final Cart? cart;

  SelectServiceModeResult(this.selectedMode, this.cart);

  @override
  String toString() {
    return 'SelectServiceModeResult[selectedMode: $selectedMode, cart: ${cart?.id}]';
  }
}

Future<SelectServiceModeResult?> showSelectServingModeSheetWithDeleteConfirm(
  BuildContext context,
  Cart? cart,
  ServingMode current, {
  int? initialPosition,
  bool useTheme = true,
  bool dismissable = true,
  bool pop = false,
  bool showSelectServingMode = true,
}) async {
  log.d(
      'showSelectServingModeSheetWithDeleteConfirm().cart=${cart?.id}, servingMode=${cart?.servingMode} current=$current');

  if (cart != null && current != cart.servingMode) {
    bool? deleted = await showdeleteCartConfirmation(context, current);
    log.d('showSelectServingModeSheetWithDeleteConfirm.deleted=$deleted');
    if (deleted == true && pop) {
      Nav.pop();
    }
    if (deleted != true) {
      return null;
    }
    getIt<TakeAwayBloc>().add(SetServingMode(current));
    return SelectServiceModeResult(
      cart.servingMode,
      deleted == true ? null : cart,
    );
  }

  return SelectServiceModeResult(
    current,
    cart,
  );
}

// Future<SelectServiceModeResult?> showDeleteConfirmIfCartPresent(
//     BuildContext context, Cart? cart, ServingMode mode,
//     {bool useTheme = true, bool dismissable = true, bool pop = false}) async {
//   log.d('showDeleteConfirmIfCartPresent().cart=${cart?.id}');

//   if (cart != null) {
//     bool? deleted = await _showdeleteCartConfirmation(context, mode);
//     log.d('showDeleteConfirmIfCartPresent.deleted=$deleted');
//     if (deleted == true && pop) {
//       Nav.pop();
//     }
//     if (deleted != true) {
//       return null;
//     }
//     return SelectServiceModeResult(
//       mode == ServingMode.inPlace ? 0 : 1,
//       deleted == true ? null : cart,
//     );
//   }

//   log.d('showDeleteConfirmIfCartPresent.mode=$mode');
//   getIt<TakeAwayBloc>().add(SetServingMode(mode));
//   return SelectServiceModeResult(
//     mode == ServingMode.inPlace ? 0 : 1,
//     cart,
//   );
// }

Future<bool?> showdeleteCartConfirmation(
    BuildContext context, ServingMode servingMode) async {
  log.d('_showdeleteCartConfirmation().start().mode=$servingMode');
  return showDialog<bool>(
    context: context,
    builder: (BuildContext context) {
      return PlatformAlertDialog(
          title: transEx(
            context,
            servingMode == ServingMode.takeAway
                ? 'servingModeSheet.dialog.title.inplace'
                : 'servingModeSheet.dialog.title.takeaway',
          ),
          description: transEx(context, 'servingModeSheet.dialog.description'),
          cancelButtonText: transEx(context, 'servingModeSheet.dialog.cancel'),
          okButtonText: transEx(context, 'servingModeSheet.dialog.ok'),
          onOkPressed: () async {
            Nav.pop(true);
            getIt<CartBloc>().add(ClearCartAction());
            getIt<TakeAwayBloc>().add(SetServingMode(servingMode));
          },
          onCancelPressed: () {
            Nav.pop(false);
          });
    },
  );
}
