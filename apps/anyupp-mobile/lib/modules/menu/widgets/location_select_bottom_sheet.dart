import '/core/dependency_indjection/dependency_injection.dart';
import '/core/units/units.dart';
import '/models.dart';
import '/modules/menu/menu.dart';
import '/modules/screens.dart';
import '/shared/locale.dart';
import '/core/theme/theme.dart';
import '/shared/widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '/shared/nav.dart';

void showLocationSelectionBottomSheet(BuildContext context) {
  final ThemeChainData theme = getIt<ThemeBloc>().state.theme;

  showModalBottomSheet(
    context: context,
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.only(
        topLeft: Radius.circular(16.0),
        topRight: Radius.circular(16.0),
      ),
    ),
    enableDrag: true,
    isScrollControlled: true,
    elevation: 4.0,
    backgroundColor: theme.secondary0,
    builder: (context) {
      return _buildBottomSheetContent(context, theme);
    },
  );
}

Widget _buildBottomSheetContent(BuildContext context, ThemeChainData theme) {
  return BlocBuilder<UnitSelectBloc, UnitSelectState>(
    builder: (context, state) {
      if (state is UnitSelected) {
        final Unit unit = state.unit;
        return Wrap(
          alignment: WrapAlignment.start,
          direction: Axis.horizontal,
          // crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.only(
                top: 19.0,
                bottom: 18.0,
              ),
              child: Center(
                child: Text(
                  transEx(context, 'location.title'),
                  style: Fonts.satoshi(
                    fontSize: 16,
                    color: const Color(0xff3c2f2f),
                    fontWeight: FontWeight.w500,
                  ),
                  textAlign: TextAlign.center,
                ),
              ),
            ),
            Divider(
              color: Color(0xFFE7E5D0),
            ),
            Container(
              padding: EdgeInsets.only(
                top: 25.0,
                left: 14.0,
                bottom: 34.0,
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    '${unit.name}',
                    style: Fonts.satoshi(
                      fontSize: 20,
                      color: theme.secondary,
                      fontWeight: FontWeight.w700,
                    ),
                    textAlign: TextAlign.left,
                  ),
                  Text(
                    unit.address.asFormattedString(),
                    style: Fonts.satoshi(
                      fontSize: 14,
                      color: theme.secondary,
                    ),
                  ),
                  SizedBox(
                    height: 19.0,
                  ),
                  if (unit.distanceInKm != null)
                    Container(
                      width: 92.0,
                      height: 28.0,
                      padding: EdgeInsets.only(
                        left: 4.0,
                        right: 4.0,
                      ),
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(6.0),
                        color: theme.highlight,
                      ),
                      child: Center(
                        child: Text(
                          '${(unit.distanceInKm)!.toStringAsFixed(3)} km',
                          style: Fonts.satoshi(
                            fontSize: 14,
                            color: theme.secondary0,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ),
                    ),
                ],
              ),
            ),
            Divider(
              color: Color(0xFFE7E5D0),
            ),
            Container(
              padding: EdgeInsets.only(
                top: 22.0,
                bottom: 22.0,
                left: 14.0,
              ),
              child: Text(
                UnitUtils.isClosed(unit)
                    ? transEx(context, "selectUnit.closed")
                    : transEx(context, "selectUnit.opened"),

                //'Nyitva: 09:00 - 22:00',
                style: Fonts.satoshi(
                  fontSize: 16,
                  color: theme.secondary,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ),
            Divider(
              color: Color(0xFFE7E5D0),
            ),
            Container(
              height: 100.0,
              padding: EdgeInsets.only(
                top: 21.0,
                left: 14.0,
                right: 14.0,
                bottom: 14.0,
              ),
              width: double.infinity,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: theme.button,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(40),
                  ),
                ),
                child: Text(
                  transEx(context, 'location.changeLocation'),
                  style: Fonts.satoshi(
                    fontSize: 18,
                    color: theme.buttonText,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                onPressed: () {
                  Nav.reset(OnBoarding());
                },
              ),
            ),
          ],
        );
      }

      return CenterLoadingWidget();
    },
  );
}
