import 'package:fa_prev/core/theme/theme.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/menu/menu.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:flutter/material.dart';
import 'allergen_grid_widget.dart';
import 'package:fa_prev/graphql/generated/crud-api.dart';

class AllergensWidget extends StatelessWidget {
  final List<Allergen> allergens;
  final double size;
  final double fontSize;
  final double iconBorderRadius;
  final bool showHeader;
  final bool showName;
  final double iconSize;
  AllergensWidget({
    required this.allergens,
    this.size = 43,
    this.fontSize = 12.0,
    this.iconBorderRadius = 12.0,
    this.showHeader = true,
    this.showName = true,
    this.iconSize = 24.0,
  });

  List<Widget> _getAllergenGrids(BuildContext context) {
    List<Widget> allergenGrids = [];
    for (Allergen allergen in allergens) {
      String name = enumToString(allergen) ?? '';
      allergenGrids.add(
        Container(
          height: size,
          // width: size,
          padding: EdgeInsets.only(
              top: 8.0,
              bottom: 16.0,
              // left: 2.0,
              right: 16.0,
              left: 16.0),
          child: AllergenGridWidget(
            allergen: trans(context, "allergens.$name"),
            index: allergenMap[allergen]!,
            assetPath: "assets/allergens/$name.svg",
            iconSize: iconSize,
            fontSize: fontSize,
            showName: showName,
          ),
        ),
      );
    }
    return allergenGrids;
  }

  @override
  Widget build(BuildContext context) {
    if (allergens.isEmpty) {
      return Container();
    }
    return Container(
      color: theme.secondary0.withOpacity(0.2),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (showHeader)
            Padding(
              padding: const EdgeInsets.only(
                  left: 16.0, bottom: 8.0, top: 4.0, right: 16.0),
              child: Text(trans(context, "allergens.title"),
                  style: Fonts.satoshi(
                    color: theme.secondary,
                    fontWeight: FontWeight.w700,
                    fontSize: fontSize,
                  )),
            ),
          if (showHeader)
            Divider(
              height: 1,
              color: theme.secondary16,
            ),
          Container(
            padding: const EdgeInsets.only(
              left: 16.0,
              right: 16.0,
              bottom: 0.0,
              top: 10.0,
            ),
            child: GridView(
              shrinkWrap: true,
              physics: NeverScrollableScrollPhysics(),
              padding: EdgeInsets.zero,
              gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 3,
                mainAxisSpacing: 0,
                crossAxisSpacing: 0,
              ),
              children: _getAllergenGrids(context),
            ),
          )
        ],
      ),
    );
  }
}
