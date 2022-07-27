import 'package:flutter/material.dart';
import '/core/theme/theme.dart';
import '/shared/locale.dart';

enum ProfileBorder {
  NONE,
  TOP,
  BOTTOM,
  TOP_AND_BOTTOM,
}

class ProfileListItemWidget extends StatelessWidget {
  final ProfileBorder? border;
  final IconData icon;
  final String titleKey;
  final bool? separator;
  final GestureTapCallback? onTap;
  const ProfileListItemWidget({
    Key? key,
    this.border = ProfileBorder.NONE,
    this.separator = false,
    this.onTap,
    required this.icon,
    required this.titleKey,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      child: Container(
        // height: 56.0,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.only(
            topLeft: _isTop() ? Radius.circular(8.0) : Radius.zero,
            topRight: _isTop() ? Radius.circular(8.0) : Radius.zero,
            bottomLeft: _isBottom() ? Radius.circular(8.0) : Radius.zero,
            bottomRight: _isBottom() ? Radius.circular(8.0) : Radius.zero,
          ),
          color: theme.secondary0,
        ),
        child: Column(
          children: [
            Row(
              // mainAxisAlignment: MainAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Padding(
                  padding: const EdgeInsets.only(left: 16.0),
                  child: Icon(
                    icon,
                    color: theme.icon,
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Text(
                    trans(context, titleKey),
                    style: Fonts.satoshi(
                      fontSize: 16.0,
                      color: theme.secondary,
                      fontWeight: FontWeight.w400,
                    ),
                  ),
                ),
                Spacer(),
                Padding(
                  padding: const EdgeInsets.only(right: 16.0),
                  child: Icon(
                    Icons.chevron_right,
                    color: theme.secondary40,
                  ),
                )
              ],
            ),
            if (separator == true)
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16.0),
                child: Divider(
                  height: 1.0,
                  color: theme.secondary12,
                ),
              )
          ],
        ),
      ),
    );
  }

  bool _isTop() {
    return border == ProfileBorder.TOP ||
        border == ProfileBorder.TOP_AND_BOTTOM;
  }

  bool _isBottom() {
    return border == ProfileBorder.BOTTOM ||
        border == ProfileBorder.TOP_AND_BOTTOM;
  }
}
