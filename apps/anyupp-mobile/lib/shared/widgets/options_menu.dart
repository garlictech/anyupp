import '/core/core.dart';
import 'package:flutter/material.dart';

Widget createOptionMenu(String text, GestureTapCallback onTap, bool divider) {
  final ThemeChainData theme = getIt<ThemeBloc>().state.theme;

  return Container(
    child: Column(
      children: [
        InkWell(
          // onTap: Navigate to a breif descrition about the app
          onTap: onTap,
          child: Column(
            children: <Widget>[
              Padding(
                  padding: EdgeInsets.symmetric(vertical: 15.0, horizontal: 15.0),
                  child: Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: <Widget>[
                    Text(
                      text,
                      style: Fonts.satoshi(
                        fontSize: 14.0,
                        fontWeight: FontWeight.w500,
                        color: theme.secondary,
                      ),
                    ),
                    Icon(
                      Icons.keyboard_arrow_right,
                      color: Colors.black38,
                    )
                  ]))
            ],
          ),
        ),
        if (divider)
          Divider(
            color: Colors.black12,
            height: 1.5,
          ),
      ],
    ),
  );
}
