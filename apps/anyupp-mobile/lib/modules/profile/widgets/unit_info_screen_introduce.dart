import 'package:anyupp/models.dart';
import 'package:anyupp/shared/locale.dart';
import 'package:flutter/material.dart';

import '/core/theme/theme.dart';

class UnitInfoScreenIntroduce extends StatelessWidget {
  final Unit unit;

  UnitInfoScreenIntroduce({Key? key, required this.unit}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [

        // introduce header
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
              trans(context, "unitinfo.introduction"),
              style: Fonts.hH5(
                  color: theme.secondary
              ),
            ),
          ),
        ),

        // introduce text
        Padding(
          padding: const EdgeInsets.only(left: 16.0, right: 16.0, top: 24.0, bottom: 36.0),
          child: Text(
            unit.description != null
                ? getLocalizedText(context, unit.description!)
                : '',
            style: Fonts.pP2(
                color: theme.secondary
            ),
          ),
        ),

      ],
    );
  }

}
