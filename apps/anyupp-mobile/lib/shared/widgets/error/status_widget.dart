import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/shared/locale/extensions/locale_extension.dart';
import 'package:fa_prev/shared/nav.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

class StatusWidget extends StatelessWidget {
  final String icon;
  final String message;
  final String? description;
  final String? details;
  final String buttonText;
  final VoidCallback? onPressed;
  final bool? showButton;
  final Color? buttonColor;

  const StatusWidget({
    Key? key,
    required this.icon,
    required this.message,
    required this.buttonText,
    this.description,
    this.details,
    this.onPressed,
    this.showButton = true,
    this.buttonColor,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    Color color = buttonColor ?? theme.primary;

    return Container(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.start,
        children: [
          Spacer(),
          SvgPicture.asset(
            icon,
            width: 80,
            height: 80,
          ),
          SizedBox(
            height: 40.0,
          ),
          Text(
            trans(context, message),
            style: Fonts.satoshi(
              fontSize: 18.0,
              fontWeight: FontWeight.w700,
            ),
          ),
          if (description != null)
            SizedBox(
              height: 16.0,
            ),
          if (description != null)
            Text(
              trans(context, description!),
              textAlign: TextAlign.center,
              style: Fonts.satoshi(
                fontSize: 14.0,
                fontWeight: FontWeight.w400,
              ),
            ),
          if (details != null)
            Text(
              details!,
              textAlign: TextAlign.center,
              style: Fonts.satoshi(
                fontSize: 12.0,
                fontWeight: FontWeight.w300,
                color: Colors.grey.withOpacity(0.7),
              ),
            ),
          Spacer(),
          Container(
            width: double.infinity,
            height: 56,
            margin: EdgeInsets.all(16.0),
            child: ElevatedButton(
              onPressed: onPressed == null ? () => Nav.pop() : onPressed,
              style: ElevatedButton.styleFrom(
                primary: color,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(40),
                ),
              ),
              child: Text(
                trans(context, buttonText),
                style: Fonts.satoshi(
                  fontSize: 16.0,
                  fontWeight: FontWeight.w700,
                  color: theme.secondary0,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
