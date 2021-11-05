import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/shared/widgets.dart';
import 'package:flutter/material.dart';
import 'package:fa_prev/core/theme/theme.dart';

Future<int?> showSelectServingModeSheet(BuildContext context, {int initialPosition = 0, bool useTheme = true}) async {
  final ThemeChainData theme = getIt<ThemeBloc>().state.theme;

  return await showModalBottomSheet(
    context: context,
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
