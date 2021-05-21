import 'package:fa_prev/models/GeneratedProduct.dart';
import 'package:fa_prev/modules/menu/screens/allergen_details_screen.dart';
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
  AllergensWidget({this.allergens , this.size = 50, this.fontSize = 16.0, this.iconBorderRadius = 12.0});

  List<Widget> getAllergenGrids(BuildContext context) {
    List<Widget> allergenGrids = [];
    if (allergens != null) {
      for (String allergen in allergens) {
        allergenGrids.add(Padding(
          padding: const EdgeInsets.all(4.0),
          child: Container(
            height: size,
            width: size,
            child: allergenGridWidget(
              allergen: trans(context, "allergens.$allergen"),
              index: GeneratedProduct.allergenMap[allergen],
              assetPath: "assets/allergens/$allergen.svg",
              borderRadius: iconBorderRadius,
              fontSize: fontSize,
            ),
          ),
        ));
      }
    }
    return allergenGrids;
  }

  @override
  Widget build(BuildContext context) {
    // TODO: implement build
    return GestureDetector(
      onTap: () => Nav.to(AllergenDetailsScreen()),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 8.0),
            child: Row(
              children: [
                Text(trans(context, "allergens.title"),
                    style: GoogleFonts.poppins(
                      color: theme.highlight,
                      fontWeight: FontWeight.normal,
                      fontSize: 13,
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
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.start,
              children: getAllergenGrids(context),
            ),
          )
        ],
      ),
    );
  }
}
