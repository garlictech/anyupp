import 'package:fa_prev/shared/locale/locale.dart';
import 'package:flutter/material.dart';

class UnitLoadInfoWidget extends StatelessWidget {
  final String titleKey;
  const UnitLoadInfoWidget({
    Key? key,
    required this.titleKey,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Text(
        trans(context, titleKey),
      ),
    );
  }
}
