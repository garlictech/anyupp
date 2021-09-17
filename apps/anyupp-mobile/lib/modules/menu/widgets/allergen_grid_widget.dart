import 'package:badges/badges.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';
import 'package:google_fonts/google_fonts.dart';

Widget allergenGridWidget(
    {required String allergen,
    required int index,
    required String assetPath,
    bool showName = false,
    double fontSize = 16.0,
    double borderRadius = 12.0,
    Color themeColor = Colors.white}) {
  return LayoutBuilder(
    builder: (context, constrains) {
      double padding = constrains.maxHeight / 6;
      return Stack(
        children: [
          Padding(
            padding: EdgeInsets.all(fontSize / 3),
            child: Container(
              padding: EdgeInsets.only(
                top: showName ? 0 : padding,
                bottom: showName ? 0 : padding,
                left: padding,
                right: padding,
              ),
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(borderRadius),
                border: Border.all(
                  width: 1.5,
                  color: Color(0xFFE7E5D0),
                ),
              ),
              child: Column(
                children: [
                  Expanded(flex: 5, child: SvgPicture.asset(assetPath)),
                  showName
                      ? Expanded(
                          flex: 1,
                          child: FittedBox(
                            fit: BoxFit.contain,
                            child: Text(
                              allergen,
                              textAlign: TextAlign.center,
                              style: GoogleFonts.poppins(
                                fontSize: padding,
                                fontWeight: FontWeight.bold,
                                color: Color(0xFF3C2F2F),
                              ),
                            ),
                          ))
                      : Container()
                ],
              ),
            ),
          ),
          Positioned(
            right: 0,
            top: 0,
            child: Container(
              height: fontSize,
              width: fontSize,
              child: Badge(
                padding: EdgeInsets.all(2.0),
                badgeColor: themeColor,
                shape: BadgeShape.circle,
                toAnimate: false,
                badgeContent: FittedBox(
                    fit: BoxFit.contain, child: Text(index.toString(), style: TextStyle(color: Colors.black))),
              ),
            ),
          )
        ],
      );
    },
  );
}
