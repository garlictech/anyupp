import 'package:fa_prev/models/GeneratedProduct.dart';
import 'package:fa_prev/modules/menu/screens/allergen_details_screen.dart';
import 'package:fa_prev/shared/utils/navigator.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/core/theme/theme.dart';

import 'allergen_grid_widget.dart';

class AllergensWidget extends StatelessWidget {
  final List<String> allergens;
  AllergensWidget(this.allergens);

  List<Widget> getAllergenGrids(BuildContext context ){
    List<Widget> allergenGrids = [];
    if (allergens != null) {
      for (String allergen in allergens) {
        allergenGrids.add(Padding(
          padding: const EdgeInsets.all(4.0),
          child: Container(
            height: 50,
            width: 50,
            child: allergenGridWidget(
                allergen: trans(context, "allergens.$allergen"),
                index: GeneratedProduct.allergenMap[allergen],
                assetPath: "assets/allergens/$allergen.svg"),
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
          Row(
            children: getAllergenGrids(context),
          )
        ],
      ),
    );
  }
}
