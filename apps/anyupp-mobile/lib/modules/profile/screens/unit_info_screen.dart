
import 'package:flutter/material.dart';

import '/core/theme/theme.dart';
import '/models.dart';
import '../profile.dart';

class UnitInfoScreen extends StatelessWidget {
  final Unit unit;
  late final Map<String, OpeningHours>? openingHours;

  UnitInfoScreen({Key? key, required this.unit}) : super(key: key) {
    // this is for the bug mentioned in Unit.dart
    openingHours = this.unit.openingHours?.map(
          (k, e) =>
          MapEntry(k, OpeningHours.fromJson(e as Map<String, dynamic>)),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: theme.secondary0,
      body: Theme(
        data: ThemeData().copyWith(
          scaffoldBackgroundColor: Colors.white,
          colorScheme: ThemeData().colorScheme.copyWith(
            primary: theme.secondary,
          ),
        ),
        child: SingleChildScrollView(
          physics: BouncingScrollPhysics(),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [

              UnitInfoScreenHeader(unit: unit),

              UnitInfoScreenOpeningHours(openingHours: openingHours),

              UnitInfoScreenIntroduce(unit: unit),

              UnitInfoScreenAvailability(unit: unit),

            ],
          ),
        ),
      ),
    );
  }

}
