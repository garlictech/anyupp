
import 'package:anyupp/core/core.dart';
import 'package:anyupp/models.dart';
import 'package:anyupp/shared/locale.dart';
import 'package:flutter/material.dart';

class UnitInfoScreenAvailability extends StatelessWidget {
  final Unit unit;

  UnitInfoScreenAvailability({Key? key, required this.unit}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [

        // Availability header
        Container(
          width: double.infinity,
          decoration: BoxDecoration(
            border: Border.symmetric(
                horizontal: BorderSide(color: theme.secondary.withOpacity(0.08), width: 1.0,)
            ),
            color: theme.secondary.withOpacity(0.04),
          ),
          child: Padding(
            padding: const EdgeInsets.only(top: 28.0, bottom: 14, left: 16.0),
            child: Text(
              trans(context, "unitinfo.availability"),
              style: Fonts.hH5(
                  color: theme.secondary
              ),
            ),
          ),
        ),

        // Availability data
        Padding(
          padding: const EdgeInsets.only(left: 16.0, right: 16.0, top: 16.0, bottom: 36.0),
          child: Table(
            columnWidths: {
              0: FixedColumnWidth(120),
              1: FlexColumnWidth(1),
            },
            children: [
              buildAvailabilityTableRow(
                  context,
                  trans(context, "login.phone.phoneNumLabel"),
                  unit.phone
              ),
              buildAvailabilityTableRow(
                  context,
                  trans(context, "unitinfo.emailAddress"),
                  unit.email
              ),
              /* todo: feature request
              buildAvailabilityTableRow(
                  context,
                  trans(context, "unitinfo.website"),
                  '...TODO' // todo
              ),*/
            ],
          ),
        ),
      ],
    );
  }



  TableRow buildAvailabilityTableRow(BuildContext context, String text, String? value) {
    if (value == null || value.isEmpty) {
      value = "-";
    }
    return TableRow(
        children: [
          Padding(
            padding: const EdgeInsets.only(bottom: 7.0),
            child: Text(
              text,
              style: Fonts.hH5(
                  color: theme.secondary
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.only(bottom: 7.0),
            child: Text(
              value,
              style: Fonts.hH5(
                  color: theme.primary
              ),
            ),
          ),
        ]
    );
  }


}
