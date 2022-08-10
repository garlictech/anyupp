import '/core/theme/theme.dart';
import '/modules/selectunit/selectunit.dart';
import '/shared/widgets.dart';
import 'package:flutter/material.dart';

class UnitMapCardWidget extends StatelessWidget {
  final theme = ThemeAnyUpp();

  final String unitName;
  final String? unitFoodType;
  final String? unitPriceType;
  final String closeTime;
  final String distance;
  final Function onTap;

  final String? image;
  final double? discount;
  final double? rating;
  final double height;
  final Color imageBackgroundColor;
  // final Unit unit;
  UnitMapCardWidget({
    required this.unitName,
    required this.closeTime,
    required this.distance,
    required this.onTap,
    this.image,
    this.unitFoodType,
    this.unitPriceType,
    this.discount,
    this.rating,
    this.height = 120.0,
    this.imageBackgroundColor = const Color(0xFFE7E7E7),
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => onTap(),
      child: Container(
        color: theme.secondary0,
        child: Row(
          mainAxisAlignment: MainAxisAlignment.start,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Stack(
              children: [
                image != null
                    ? ImageWidget(
                        width: height,
                        height: height,
                        url: image,
                        fit: BoxFit.cover,
                      )
                    : NoUnitImageWidget(
                        backgroundColor: imageBackgroundColor,
                        textColor: theme.secondary64,
                        height: height,
                      ),
                Positioned(
                  left: 4.0,
                  bottom: 4.0,
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 6.0,
                      vertical: 3.0,
                    ),
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(
                        32.0,
                      ),
                      border: Border.all(
                        width: 1,
                        color: theme.secondary0,
                      ),
                      color: theme.secondary0,
                    ),
                    child: Text(distance,
                        style: Fonts.pP3Bold(
                          color: theme.secondary,
                        )),
                  ),
                ),
              ],
            ),
            SizedBox(
              width: 12.0,
            ),
            Expanded(
              child: Column(
                // alignment: WrapAlignment.start,
                // direction: Axis.vertical,
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Flexible(
                    child: Text(
                      unitName,
                      style: Fonts.hH4(),
                      softWrap: true,
                      overflow: TextOverflow.ellipsis,
                      maxLines: 2,
                    ),
                  ),
                  SizedBox(
                    height: 4,
                  ),
                  Flexible(
                    child: Text(
                      getInfoLineText(),
                      style: Fonts.pP3(color: Color(0xFF7F7F7F)),
                    ),
                  ),
                  if (rating != null)
                    SizedBox(
                      height: 4,
                    ),
                  if (rating != null)
                    Row(
                      children: [
                        Icon(
                          Icons.star,
                          color: Color.fromRGBO(48, 191, 96, 1),
                          size: 13,
                        ),
                        SizedBox(
                          width: 4,
                        ),
                        Text(
                          rating.toString(),
                          style: Fonts.pP2Regular(
                              color: Color.fromRGBO(48, 191, 96, 1)),
                        )
                      ],
                    ),
                  if (rating == null)
                    SizedBox(
                      height: 32.0,
                    ),
                ],
              ),
            ),
            SizedBox(
              width: 8.0,
            ),
          ],
        ),
      ),
    );
  }

  String getInfoLineText() {
    StringBuffer sb = StringBuffer();
    if (unitFoodType != null) {
      sb.write(unitFoodType);
      sb.write(' • ');
    }
    if (unitPriceType != null) {
      sb.write(unitPriceType);
      sb.write(' • ');
    }
    sb.write(closeTime);
    return sb.toString();
  }
}
