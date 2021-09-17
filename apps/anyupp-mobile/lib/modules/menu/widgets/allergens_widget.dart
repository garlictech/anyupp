import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/menu/menu.dart';
import 'package:fa_prev/shared/utils/navigator.dart';
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/core/theme/theme.dart';

import 'allergen_grid_widget.dart';

class AllergensWidget extends StatelessWidget {
  final List<String> allergens;
  final double size;
  final double fontSize;
  final double iconBorderRadius;
  final bool showHeader;
  AllergensWidget({
    required this.allergens,
    this.size = 43,
    this.fontSize = 16.0,
    this.iconBorderRadius = 12.0,
    this.showHeader = true,
  });

  List<Widget> getAllergenGrids(BuildContext context) {
    List<Widget> allergenGrids = [];
    for (String allergen in allergens) {
      allergenGrids.add(Padding(
        padding: EdgeInsets.only(
          top: 4.0,
          bottom: 4.0,
          left: 2.0,
          right: 2.0,
        ), //const EdgeInsets.all(4.0),
        child: Container(
          height: size,
          width: size,
          child: allergenGridWidget(
              allergen: trans(context, "allergens.$allergen"),
              index: allergenMap[allergen]!,
              assetPath: "assets/allergens/$allergen.svg",
              borderRadius: iconBorderRadius,
              fontSize: fontSize,
              themeColor: theme.background),
        ),
      ));
    }
    return allergenGrids;
  }

  @override
  Widget build(BuildContext context) {
    if (allergens.isEmpty) {
      return Container();
    }
    return GestureDetector(
      onTap: () => Nav.to(AllergenDetailsScreen()),
      child: Container(
        color: theme.background.withOpacity(0.2),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (showHeader)
              Padding(
                padding: const EdgeInsets.only(left: 15.0, bottom: 8.0, top: 4.0),
                child: Row(
                  children: [
                    Text(trans(context, "allergens.title"),
                        style: GoogleFonts.poppins(
                          color: theme.highlight,
                          fontWeight: FontWeight.normal,
                          fontSize: fontSize,
                        )),
                    SizedBox(
                      width: 5,
                    ),
                    Icon(
                      Icons.info,
                      color: theme.highlight,
                    )
                  ],
                ),
              ),
            Container(
              padding: const EdgeInsets.only(left: 12.0, bottom: 8.0),
              child: SingleChildScrollView(
                physics: BouncingScrollPhysics(),
                scrollDirection: Axis.horizontal,
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.start,
                  children: getAllergenGrids(context),
                ),
              ),
            )
          ],
        ),
      ),
    );
  }
}
