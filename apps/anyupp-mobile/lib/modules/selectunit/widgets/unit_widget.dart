import 'package:carousel_slider/carousel_slider.dart';
import 'package:fa_prev/core/theme/theme.dart';
import 'package:fa_prev/modules/selectunit/widgets/no_unit_image_widget.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/shared/widgets.dart';
import 'package:flutter/material.dart';

class UnitWidget extends StatefulWidget {
  final String unitName;
  final String? unitFoodType;
  final String? unitPriceType;
  final String closeTime;
  final String distance;
  final bool? isFavorite;
  final Function onTap;

  final List<String>? imageList;
  final double? discount;
  final double? rating;
  // final GeoUnit unit;
  UnitWidget({
    required this.unitName,
    required this.closeTime,
    required this.distance,
    required this.onTap,
    this.imageList,
    this.unitFoodType,
    this.unitPriceType,
    this.isFavorite,
    this.discount,
    this.rating,
  });

  @override
  State<UnitWidget> createState() => _UnitWidgetState();
}

class _UnitWidgetState extends State<UnitWidget> {
  int _current = 0;
  bool? _isFavorite;
  final CarouselController _controller = CarouselController();
  final theme = ThemeAnyUpp();

  @override
  void initState() {
    _isFavorite = widget.isFavorite;
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => widget.onTap(),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Stack(alignment: Alignment.bottomCenter, children: [
            widget.imageList != null
                ? Container(
                    child: Stack(
                      children: [
                        Container(
                          child: ClipRRect(
                            borderRadius:
                                BorderRadius.all(Radius.circular(4.0)),
                            child: ImageWidget(
                              url: widget.imageList!.first,
                              fit: BoxFit.cover,
                              width: double.infinity,
                              height: 190.0,
                            ),
                          ),
                        ),
                        if (_isFavorite != null)
                          Positioned(
                            top: 0,
                            right: 0,
                            child: IconButton(
                              iconSize: 20,
                              icon: Icon(
                                _isFavorite!
                                    ? Icons.favorite
                                    : Icons.favorite_border,
                                color: theme.secondary0,
                              ),
                              onPressed: () => setState(() {
                                _isFavorite = !_isFavorite!;
                              }),
                            ),
                          )
                      ],
                    ),
                  )
                : NoUnitImageWidget(
                    height: 190,
                    backgroundColor: theme.secondary12,
                    textColor: theme.secondary64,
                  ),
            if (widget.discount != null)
              Positioned(
                  left: 4,
                  top: 4,
                  child: Container(
                    width: 139,
                    height: 27,
                    decoration: BoxDecoration(
                      color: theme.secondary64,
                      borderRadius: BorderRadius.all(
                        Radius.circular(2),
                      ),
                    ),
                    child: FittedBox(
                      fit: BoxFit.contain,
                      child: Padding(
                        padding: const EdgeInsets.symmetric(
                            vertical: 4, horizontal: 6),
                        child: Row(
                          children: [
                            Icon(
                              Icons.label,
                              color: theme.secondary0,
                              size: 10,
                            ),
                            SizedBox(
                              width: 4,
                            ),
                            Text(
                              widget.discount!.toString() +
                                  '% ' +
                                  trans('selectUnit.discount'),
                              style: Fonts.pP2Regular(color: theme.secondary0),
                            ),
                          ],
                        ),
                      ),
                    ),
                  )),
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 12),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: (widget.imageList ?? []).asMap().entries.map((entry) {
                  return GestureDetector(
                    onTap: () => _controller.animateToPage(entry.key),
                    child: Container(
                      width: 4.0,
                      height: 4.0,
                      margin:
                          EdgeInsets.symmetric(vertical: 8.0, horizontal: 4.0),
                      decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: theme.secondary40
                              .withOpacity(_current == entry.key ? 0.9 : 0.4)),
                    ),
                  );
                }).toList(),
              ),
            ),
          ]),
          SizedBox(
            height: 8,
          ),
          Text(
            widget.unitName,
            style: Fonts.hH4(),
          ),
          SizedBox(
            height: 4,
          ),
          Text(
            getInfoLineText(),
            style: Fonts.pP2Regular(color: Color.fromRGBO(127, 127, 127, .64)),
          ),
          if (widget.rating != null)
            SizedBox(
              height: 4,
            ),
          if (widget.rating != null)
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
                  widget.rating.toString(),
                  style:
                      Fonts.pP2Regular(color: Color.fromRGBO(48, 191, 96, 1)),
                )
              ],
            ),
          SizedBox(
            height: 32,
          )
        ],
      ),
    );
  }

  String getInfoLineText() {
    StringBuffer sb = StringBuffer();
    if (widget.unitFoodType != null) {
      sb.write(widget.unitFoodType);
      sb.write(' • ');
    }
    if (widget.unitPriceType != null) {
      sb.write(widget.unitPriceType);
      sb.write(' • ');
    }
    // sb.write(trans('selectUnit.close'));
    // sb.write(' ');
    sb.write(widget.closeTime);
    sb.write(' • ');
    sb.write(widget.distance);
    sb.write(' ');
    sb.write(trans('selectUnit.distance'));
    return sb.toString();
  }
}
