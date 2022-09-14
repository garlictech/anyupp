import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

import '/modules/login/login.dart';

class SocialLoginButtonWidget extends StatelessWidget {
  final String providerIcon;

  final LoginMethod method;

  final Color borderColor;

  final double size;

  final double iconSize;

  final Color? iconColor;

  final VoidCallback onTap;

  const SocialLoginButtonWidget({
    required this.providerIcon,
    required this.method,
    this.borderColor = const Color(0xffe7e5d0),
    this.size = 70.0,
    this.iconSize = 26.0,
    this.iconColor,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap, //() => getIt<LoginBloc>().add(LoginWithMethod(method)),
      child: Container(
        width: size,
        height: size,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(12.0),
          border: Border.all(
            width: 1.5,
            color: borderColor,
          ),
        ),
        child: Container(
          height: iconSize,
          width: iconSize,
          padding: EdgeInsets.all(
            (size - iconSize) / 2.444444444,
          ),
          child: SvgPicture.asset(
            'assets/icons/brand-$providerIcon.svg',
            color: iconColor,
          ),
        ),
      ),
    );
  }
}
