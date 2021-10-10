import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/models/GeoUnit.dart';
import 'package:fa_prev/models/extensions/OpeningHoursExtension.dart';
import 'package:fa_prev/modules/menu/menu.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/shared/widgets.dart';
import 'package:flutter/material.dart';
import 'package:fa_prev/graphql/generated/crud-api.dart';
import 'package:flutter_svg/svg.dart';

class UnitCardWidget extends StatelessWidget {
  final GeoUnit unit;
  final GestureTapCallback? onTap;

  const UnitCardWidget({
    Key? key,
    required this.unit,
    this.onTap,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    // print('unit.supportedServingModes=${unit.supportedServingModes}');
    return InkWell(
      key: const Key('unit-widget'),
      onTap: onTap,
      child: Container(
        width: MediaQuery.of(context).size.width / (3 / 2),
        margin: EdgeInsets.only(
          left: 4.0,
          right: 4.0,
        ),
        padding: EdgeInsets.only(
          top: 22.0,
          bottom: 10.0,
          left: 18.0,
          right: 14.0,
        ),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(12.0),
          border: Border.all(
            width: 1.5,
            color: Color(0xFFE7E5D0),
          ),
        ),
        child: Stack(
          children: [
            Container(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  Text(
                    unit.name,
                    maxLines: 2,
                    style: Fonts.satoshi(
                      fontSize: 14.0,
                      fontWeight: FontWeight.w600,
                      color: Color(0xFF3C2F2F),
                    ),
                  ),
                  Text(
                    unit.address.address,
                    maxLines: 2,
                    style: Fonts.satoshi(
                      fontSize: 12.0,
                      fontWeight: FontWeight.w400,
                      color: Color(0xFF3C2F2F),
                    ),
                  ),
                  FittedBox(
                    fit: BoxFit.contain,
                    child: Text(
                      GeoUnitUtils.isClosed(unit)
                          ? GeoUnitUtils.getClosedText(
                              unit,
                              transEx(context, "selectUnit.closed"),
                              transEx(context, "selectUnit.opens"),
                              transEx(context,
                                  "selectUnit.weekdays.${GeoUnitUtils.getOpenedHour(unit)?.getDayString()}"),
                            )
                          : transEx(context, "selectUnit.opened") +
                              ": " +
                              transEx(
                                  context,
                                  GeoUnitUtils.getOpenedHour(unit)!
                                      .getOpenRangeString()!),
                      style: Fonts.satoshi(
                        fontSize: 12.0,
                        fontWeight: FontWeight.w400,
                        color: Color(0xFF3C2F2F),
                      ),
                    ),
                  ),
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.only(
                          top: 4.0,
                          bottom: 4.0,
                          left: 8.0,
                          right: 8.0,
                        ),
                        margin: EdgeInsets.only(top: 10.0),
                        height: 25.0,
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(6.0),
                          color: const Color(0xFF30BF60),
                        ),
                        child: Center(
                            child: Text(
                          (unit.distance / 1000).toStringAsFixed(3) + ' km',
                          style: Fonts.satoshi(
                            fontSize: 12,
                            color: const Color(0xffffffff),
                            fontWeight: FontWeight.w500,
                          ),
                        )),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            // Takeaway buttons
            Positioned(
              bottom: 0,
              right: 0,
              child: Row(
                children: [
                  if (unit.supportedServingModes.contains(ServingMode.inPlace))
                    BorderedWidget(
                        width: 32.0,
                        height: 32.0,
                        child: Padding(
                          padding: const EdgeInsets.all(6.0),
                          child: SvgPicture.asset(
                            'assets/icons/restaurant_menu_black.svg',
                          ),
                        )),
                  if (unit.supportedServingModes.contains(ServingMode.takeAway))
                    SizedBox(
                      width: 4.0,
                    ),
                  if (unit.supportedServingModes.contains(ServingMode.takeAway))
                    BorderedWidget(
                        width: 32.0,
                        height: 32.0,
                        child: SvgPicture.asset(
                          "assets/icons/bag.svg",
                          color: theme.secondary,
                          width: 18.0,
                          height: 18.0,
                        )),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
