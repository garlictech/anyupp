import 'package:fa_prev/shared/widgets.dart';
import 'package:flutter/material.dart';
import 'package:fa_prev/core/theme/theme.dart';

class CustomAppBar extends StatelessWidget implements PreferredSizeWidget {
  final String? title;
  final double? elevation;
  final bool showBackButtonBorder;
  CustomAppBar({
    Key? key,
    this.title,
    this.elevation = 0.0,
    this.showBackButtonBorder = true,
  })  : preferredSize = Size.fromHeight(kToolbarHeight),
        super(key: key);

  @override
  final Size preferredSize;

  @override
  Widget build(BuildContext context) {
    return AppBar(
        leading: Padding(
          padding: const EdgeInsets.only(
            top: 8.0,
            bottom: 8.0,
            left: 15.0,
          ),
          child: BackButtonWidget(
            color: theme.secondary,
            showBorder: showBackButtonBorder,
            icon: Icons.arrow_back,
          ),
        ),
        elevation: elevation,
        shadowColor: theme.secondary0.withOpacity(0.5),
        centerTitle: true,
        // iconTheme: IconThemeData(
        //   color: theme.secondary, //change your color here
        // ),
        backgroundColor: theme.secondary0,
        title: title != null
            ? Text(
                title!,
                style: Fonts.satoshi(
                  color: theme.secondary,
                  fontSize: 16.0,
                  fontWeight: FontWeight.w700,
                ),
                //getLocalizedText(context, widget.item.name),
              )
            : Container());
  }
}
