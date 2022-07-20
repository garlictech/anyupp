import '/ui/views/shared/app_theme.dart';
import 'package:flutter/material.dart';

class AppBarWidget extends StatelessWidget implements PreferredSizeWidget {
  final String titleText;

  const AppBarWidget({Key? key, required this.titleText})
      : preferredSize = const Size.fromHeight(kToolbarHeight),
        super(key: key);

  @override
  Widget build(BuildContext context) {
    return AppBar(
      backgroundColor: AppTheme.of(context).primaryColor,
      automaticallyImplyLeading: false,
      title: Align(
        alignment: const AlignmentDirectional(0, 0.05),
        child: Text(
          titleText,
          style: AppTheme.of(context).title2.override(
              color: Colors.white,
              fontSize: 22,
              fontFamily: AppTheme.of(context).fontFamily),
        ),
      ),
      actions: const [],
      centerTitle: false,
      elevation: 2,
    );
  }

  @override
  final Size preferredSize;
}
