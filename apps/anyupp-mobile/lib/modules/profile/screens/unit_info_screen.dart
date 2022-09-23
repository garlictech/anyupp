import 'package:flutter/material.dart';

import '/core/theme/theme.dart';
import '/models.dart';
import '../profile.dart';

class UnitInfoScreen extends StatelessWidget {
  final Unit unit;

  const UnitInfoScreen({Key? key, required this.unit}) : super(key: key);

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
              UnitInfoScreenOpeningHours(openingHours: unit.openingHours),
              UnitInfoScreenIntroduce(unit: unit),
              UnitInfoScreenAvailability(unit: unit),
            ],
          ),
        ),
      ),
    );
  }
}
