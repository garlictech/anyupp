import '/core/core.dart';
import '/models.dart';
import '/modules/cart/cart.dart';
import '/modules/screens.dart';
import '/modules/selectunit/selectunit.dart';
import '/shared/locale/locale.dart';
import '/shared/nav.dart';
import '/shared/widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

class UnitInfoHeaderWidget extends StatelessWidget {
  final GeoUnit unit;
  const UnitInfoHeaderWidget({
    Key? key,
    required this.unit,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            unit.hasBanner
                ? ImageWidget(
                    url: unit.coverBanners![0].imageUrl,
                    fit: BoxFit.cover,
                    height: 104.0,
                    width: double.infinity,
                  )
                : NoUnitImageWidget(
                    backgroundColor: theme.secondary12,
                    textColor: theme.secondary64,
                    height: 104.0,
                  ),
            // Unit name and info
            Padding(
              padding: const EdgeInsets.only(
                top: 44.0,
                left: 16.0,
                right: 16.0,
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    unit.name,
                    style: Fonts.hH1(),
                  ),
                  Text(
                    '${getOpeningText(context, unit)} • ${(unit.distance / 1000).toStringAsFixed(0)}m ${trans(context, 'selectUnit.distance')}',
                    style: Fonts.pP1(color: theme.secondary64),
                  ),
                  // Unit details link
                  InkWell(
                    onTap: () => Nav.to(UnitInfoScreen(unit: unit)),
                    child: Padding(
                      padding: const EdgeInsets.only(top: 25.0),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        mainAxisAlignment: MainAxisAlignment.start,
                        children: [
                          Icon(
                            Icons.description,
                            color: theme.icon,
                          ),
                          SizedBox(
                            width: 16.0,
                          ),
                          Text(
                            trans(context, 'unitinfo.infoButton'),
                            style: Fonts.pP1(color: theme.secondary),
                          ),
                          Spacer(),
                          Icon(
                            Icons.chevron_right,
                            color: theme.secondary40,
                          ),
                        ],
                      ),
                    ),
                  )
                ],
              ),
            ),
          ],
        ),
        // Unit logo
        if (theme.images?.logo != null)
          Positioned(
            left: 16,
            top: 104.0 - 40.0,
            child: Container(
              height: 80,
              width: 80,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.all(
                  Radius.circular(44.0),
                ),
                border: Border.all(
                  width: 1.5,
                  color: theme.secondary16,
                ),
                color: theme.secondary0,
              ),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(44.0),
                child: ImageWidget(
                  //width: 200,
                  // height: 30,
                  url: theme.images?.logo != null
                      ? theme.images?.logo
                      : 'assets/images/kajahu-logo.svg',
                  errorWidget: Padding(
                    padding: const EdgeInsets.all(8.0),
                    child: SvgPicture.asset(
                      'assets/images/kajahu-logo.svg',
                      fit: BoxFit.fitWidth,
                      width: 80.0,
                      height: 80.0,
                    ),
                  ),
                  fit: BoxFit.fitWidth,
                  width: 80.0,
                  height: 80.0,
                ),
              ),
            ),
          ),
        // Place
        StreamBuilder<Cart?>(
            stream: getIt<CartRepository>().getCurrentCartStream(unit.id),
            builder: (context, AsyncSnapshot<Cart?> snapshot) {
              Place? place = snapshot.data?.place;
              // log.e('Header.place=$place');
              if (place != null) {
                return Positioned(
                  right: 16.0,
                  top: 104.0 - 20.0,
                  child: Container(
                    // height: 80,
                    // width: 80,
                    padding: const EdgeInsets.all(8.0),
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.all(
                        Radius.circular(44.0),
                      ),
                      border: Border.all(
                        width: 1.5,
                        color: theme.secondary16,
                      ),
                      color: theme.secondary0,
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.start,
                      children: [
                        SvgPicture.asset(
                          'assets/icons/table-icon.svg',
                          width: 20,
                          height: 20,
                          color: theme.icon,
                        ),
                        Text(
                          ' ${snapshot.data?.place?.table ?? "-"}',
                          style: Fonts.satoshi(
                            color: theme.secondary,
                            fontSize: 14.0,
                            fontWeight: FontWeight.w400,
                          ),
                        ),
                        SvgPicture.asset(
                          'assets/icons/chair-icon.svg',
                          width: 20,
                          height: 20,
                          color: theme.icon,
                        ),
                        Text(
                          '${snapshot.data?.place?.seat ?? "-"}',
                          style: Fonts.satoshi(
                            color: theme.secondary,
                            fontSize: 14.0,
                            fontWeight: FontWeight.w400,
                          ),
                        )
                      ],
                    ),
                  ),
                );
              }
              return Container();
            }),
      ],
    );
  }
}
