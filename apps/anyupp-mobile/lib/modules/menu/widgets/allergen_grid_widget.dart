import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';
import 'package:google_fonts/google_fonts.dart';

Widget allergenGridWidget(
    {String allergen, int index, String assetPath, bool showName = false}) {
  return LayoutBuilder(
    builder: (context, constrains) {
      double padding = constrains.maxHeight/4;
      return Stack(
        children: [
          Container(
            // margin: EdgeInsets.only(
            //   left: 4.0,
            //   right: 4.0,
            // ),
            padding: EdgeInsets.only(
              top: showName ? 0 : padding,
              bottom: showName ? 0 : padding,
              left: padding,
              right: padding,
            ),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(12.0),
              border: Border.all(
                width: 1.5,
                color: Color(0xFFE7E5D0),
              ),
            ),
            child: Column(
              children: [
                Expanded(
                    flex: 5,
                    child: SvgPicture.asset(assetPath)),
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
                Positioned(
          top: 2,
          left: 7,
          child: Text(
            index.toString(),
            textAlign: TextAlign.center,
            style: GoogleFonts.poppins(
              //fontSize: 16.0,
              fontWeight: FontWeight.w600,
              color: Color(0xFF3C2F2F),
            ),
          ))
        ],
      );
    },
  );
}
