import '/models.dart';
import '/shared/locale/locale.dart';
import '/shared/widgets.dart';
import 'package:flutter/material.dart';
import '/core/theme/theme.dart';

class UnitInfoScreen extends StatelessWidget {
  final GeoUnit unit;
  const UnitInfoScreen({Key? key, required this.unit}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: theme.secondary0,
      appBar: CustomAppBar(
        title: trans(context, 'unitinfo.title'),
        showBackButtonBorder: false,
        elevation: 4.0,
      ),
      body: Theme(
        data: ThemeData().copyWith(
          scaffoldBackgroundColor: Colors.white,
          colorScheme: ThemeData().colorScheme.copyWith(
                primary: theme.secondary,
              ),
        ),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Unit's name
              Text(
                unit.name,
                style: Fonts.hH1(color: theme.secondary),
              ),
              SizedBox(
                height: 12.0,
              ),
              Text(
                unit.description != null
                    ? getLocalizedText(context, unit.description!)
                    : '',
                style: Fonts.pP2(color: theme.secondary),
              ),
              SizedBox(
                height: 24.0,
              ),
              Text(
                unit.email ?? '',
                textAlign: TextAlign.justify,
                style: Fonts.pP2(color: theme.primary).copyWith(
                  decoration: TextDecoration.underline,
                ),
              ),
              SizedBox(
                height: 26.0,
              ),
              Text(
                unit.phone ?? '',
                style: Fonts.pP2(color: theme.primary).copyWith(
                  decoration: TextDecoration.underline,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
