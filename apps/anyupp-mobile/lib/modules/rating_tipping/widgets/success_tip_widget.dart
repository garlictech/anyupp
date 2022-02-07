import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/shared/locale/locale.dart';
import 'package:fa_prev/shared/nav.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

class SuccessTipWidget extends StatelessWidget {
  const SuccessTipWidget({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: () => Nav.pop(),
      child: Container(
        padding: EdgeInsets.all(32.0),
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              SvgPicture.asset(
                'assets/icons/success_order.svg',
                width: 80.0,
                height: 80.0,
              ),
              SizedBox(
                height: 40.0,
              ),
              Text(
                trans(context, 'tipping.success'),
                textAlign: TextAlign.center,
                style: Fonts.satoshi(
                  fontSize: 18.0,
                  fontWeight: FontWeight.w700,
                  color: theme.secondary,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
