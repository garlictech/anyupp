import 'package:anyupp/models.dart';
import 'package:anyupp/shared/locale.dart';
import 'package:flutter/material.dart';

import '/core/theme/theme.dart';

class UnitInfoScreenOpeningHours extends StatelessWidget {
  final Map<String, OpeningHours>? openingHours;

  const UnitInfoScreenOpeningHours({Key? key, required this.openingHours})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // opening hours header
        Container(
          width: double.infinity,
          decoration: BoxDecoration(
            border: Border.symmetric(
                horizontal: BorderSide(
              color: theme.secondary.withOpacity(0.08),
              width: 1.0,
            )),
            color: theme.secondary.withOpacity(0.04),
          ),
          child: Padding(
            padding: const EdgeInsets.only(top: 28.0, bottom: 14, left: 16.0),
            child: Text(
              trans(context, "unitinfo.openingHours"),
              style: Fonts.hH5(color: theme.secondary),
            ),
          ),
        ),

        // opening hours table
        Padding(
          padding: const EdgeInsets.only(
              left: 16.0, right: 16.0, top: 16.0, bottom: 36.0),
          child: Table(
            columnWidths: {
              0: FixedColumnWidth(120),
              1: FlexColumnWidth(1),
            },
            children: [
              for (int i = 1; i <= 7; i++)
                buildOpeningHoursTableRow(
                    context,
                    trans(context, "selectUnit.weekdays." + ohDays[i]!)
                        .capitalize(),
                    openingHours?[ohDayCodes[i]]),
            ],
          ),
        ),
      ],
    );
  }

  TableRow buildOpeningHoursTableRow(
      BuildContext context, String dayName, OpeningHours? openingHours) {
    String value = "";
    if (openingHours != null) {
      value = openingHours.getOpenRangeString();
    }

    return TableRow(children: [
      Padding(
        padding: const EdgeInsets.only(bottom: 7.0),
        child: Text(
          dayName,
          style: Fonts.hH5(color: theme.secondary),
        ),
      ),
      Padding(
        padding: const EdgeInsets.only(bottom: 7.0),
        child: Text(
          value,
          style: Fonts.hH5(color: theme.secondary),
        ),
      ),
    ]);
  }
}
