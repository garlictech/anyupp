import '/shared/widgets.dart';
import 'package:flutter/material.dart';
import '/core/theme/theme.dart';
import '/graphql/generated/crud-api.dart';
import 'package:flutter_svg/flutter_svg.dart';
import '/shared/locale.dart';

class TakeawayStatusWidget extends StatelessWidget {
  final ServingMode servingMode;
  final double padding;
  final double iconSize;

  const TakeawayStatusWidget({
    Key? key,
    required this.servingMode,
    this.padding = 12.0,
    this.iconSize = 20.0,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return BorderedWidget(
      onPressed: null,
      borderColor: theme.secondary12,
      color: theme.secondary12,
      // width: 40.0,
      height: 30,
      child: Padding(
        padding: EdgeInsets.symmetric(horizontal: padding),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            servingMode == ServingMode.takeAway
                ? SvgPicture.asset(
                    "assets/icons/bag.svg",
                    color: theme.secondary,
                    width: iconSize,
                    height: iconSize,
                  )
                : SvgPicture.asset(
                    'assets/icons/restaurant_menu_black.svg',
                    width: iconSize,
                    height: iconSize,
                    color: theme.secondary,
                  ),
            SizedBox(
              width: 4.0,
            ),
            Text(
              servingMode == ServingMode.takeAway ? trans(context, 'cart.takeAway') : trans(context, 'cart.inPlace'),
              style: Fonts.satoshi(
                fontSize: 14.0,
                color: theme.secondary,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
