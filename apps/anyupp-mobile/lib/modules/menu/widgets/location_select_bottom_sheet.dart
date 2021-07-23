import 'package:fa_prev/core/dependency_indjection/dependency_injection.dart';
import 'package:fa_prev/core/units/units.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/screens.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/core/theme/theme.dart';
import 'package:fa_prev/shared/widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:fa_prev/shared/nav.dart';

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
    backgroundColor: theme.background,
    builder: (context) {
      return _buildBottomSheetContent(context, theme);
    },
  );
}

Widget _buildBottomSheetContent(BuildContext context, ThemeChainData theme) {
  return BlocBuilder<UnitSelectBloc, UnitSelectState>(
    builder: (context, state) {
      if (state is UnitSelected) {
        final GeoUnit unit = state.unit;

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
                  style: GoogleFonts.poppins(
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
                    style: GoogleFonts.poppins(
                      fontSize: 20,
                      color: theme.text,
                      fontWeight: FontWeight.w700,
                    ),
                    textAlign: TextAlign.left,
                  ),
                  Text(
                    '${unit.address.city}, ${unit.address.address}, ${unit.address.postalCode}',
                    style: GoogleFonts.poppins(
                      fontSize: 14,
                      color: theme.text,
                    ),
                  ),
                  SizedBox(
                    height: 19.0,
                  ),
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
                        '${((unit.distance ?? 0) / 1000).toStringAsFixed(3)} km',
                        style: GoogleFonts.poppins(
                          fontSize: 14,
                          color: theme.text2,
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
                //'${unit.openingHours ?? ""}',
                unit.getOpeningString() != null
                    ? transEx(context, "selectUnit.opened") +
                        " : " +
                        unit.getOpeningString()
                    : transEx(context, "selectUnit.closed"),
                //'Nyitva: 09:00 - 22:00',
                style: GoogleFonts.poppins(
                  fontSize: 16,
                  color: theme.text,
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
                  primary: theme.indicator,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10),
                  ),
                ),
                child: Text(
                  transEx(context, 'location.changeLocation'),
                  style: GoogleFonts.poppins(
                    fontSize: 18,
                    color: theme.text2,
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
