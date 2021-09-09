import 'package:flutter/material.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:fa_prev/core/theme/theme.dart';

typedef OnEmptyWidgetButtonTap = void Function();

class EmptyWidget extends StatelessWidget {
  final String? messageKey;
  final String? descriptionKey;
  final OnEmptyWidgetButtonTap? onTap;
  final String? buttonTextKey;
  final String? icon;

  const EmptyWidget({
    Key? key,
    this.messageKey,
    this.descriptionKey,
    this.onTap,
    this.buttonTextKey,
    this.icon = 'assets/icons/empty-box.svg',
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      child: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: _buildWidgetColumn(context),
        ),
      ),
    );
  }

  List<Widget> _buildWidgetColumn(BuildContext context) {
    var widgets = <Widget>[];
    if (icon != null) {
      widgets.add(
        SvgPicture.asset(
          icon!,
          width: 104.0,
          fit: BoxFit.fitWidth,
        ),
      );
      widgets.add(
        SizedBox(
          height: 32.0,
        ),
      );
    }

    if (messageKey != null) {
      widgets.add(Text(
        trans(context, messageKey!),
        style: GoogleFonts.poppins(
          color: theme.text,
          fontSize: 16.0,
          fontWeight: FontWeight.w600,
        ),
      ));
    }

    if (descriptionKey != null) {
      widgets.add(SizedBox(
        height: 4.0,
      ));
      widgets.add(Text(
        trans(context, descriptionKey!),
        style: GoogleFonts.poppins(
          color: theme.text,
          fontSize: 12.0,
          fontWeight: FontWeight.normal,
        ),
      ));
    }

    if (onTap != null && buttonTextKey != null) {
      widgets.add(SizedBox(
        height: 32.0,
      ));
      widgets.add(ElevatedButton(
        style: ElevatedButton.styleFrom(
          primary: theme.indicator,
          padding: EdgeInsets.only(
            top: 16,
            bottom: 16,
            left: 24,
            right: 24,
          ),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(10),
          ),
        ),
        child: Text(
          trans(context, buttonTextKey!),
          style: GoogleFonts.poppins(
            fontSize: 16,
            color: theme.text2,
            fontWeight: FontWeight.normal,
          ),
        ),
        onPressed: onTap,
      ));
    }
    return widgets;
  }
}
