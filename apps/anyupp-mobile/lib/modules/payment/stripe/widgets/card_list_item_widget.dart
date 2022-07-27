import '/core/core.dart';
import '/models.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

class CardListTileWidget extends StatelessWidget {
  final StripePaymentMethod method;
  final GestureTapCallback? onTap;
  final Widget? trailing;
  const CardListTileWidget({
    Key? key,
    required this.method,
    this.trailing,
    this.onTap,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ListTile(
      onTap: onTap,
      contentPadding: EdgeInsets.only(right: 12.0, left: 16.0),
      title: Text(
        '${method.brand} **** ${method.last4}',
        style: Fonts.satoshi(
          color: theme.secondary,
          fontSize: 16.0,
        ),
      ),
      subtitle: Text(
        '${method.expMonth}/${method.expYear}',
        style: Fonts.satoshi(
          color: theme.secondary40,
          fontSize: 12.0,
        ),
      ),
      leading: Padding(
        padding: EdgeInsets.zero,
        child: Container(
          width: 44,
          height: 32,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(4.0),
            color: theme.secondary12,
          ),
          padding: EdgeInsets.symmetric(
            horizontal: 7.0,
            vertical: 4.0,
          ),
          child: (method.brand == 'mastercard' ||
                  method.brand == 'visa' ||
                  method.brand == 'maestro')
              ? SvgPicture.asset(
                  'assets/icons/brand-${method.brand}.svg',
                  // height: 73.0,
                  // width: 73.0,
                  // fit: BoxFit.cover,
                )
              : Container(),
        ),
      ),
      trailing: trailing,
    );
  }
}
