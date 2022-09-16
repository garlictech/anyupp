import 'package:carousel_slider/carousel_slider.dart';
import '/core/theme/theme.dart';
import '/modules/selectunit/widgets/no_unit_image_widget.dart';
import '/shared/locale.dart';
import '/shared/widgets.dart';
import 'package:flutter/material.dart';

class UnitWidget extends StatefulWidget {
  final String unitName;
  final String? unitFoodType;
  final String? unitPriceType;
  final String closeTime;
  final double? distanceInKm;
  final bool? isFavorite;
  final Function onTap;

  final List<String>? imageList;
  final double? discount;
  final double? rating;
  // final Unit unit;
  UnitWidget({
    required this.unitName,
    required this.closeTime,
    this.distanceInKm,
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
  void dispose() {
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    var images = widget.imageList?.map((image) {
      return Container(
        child: Stack(
          children: [
            ClipRRect(
              borderRadius: BorderRadius.all(Radius.circular(4.0)),
              child: ImageWidget(
                url: image,
                fit: BoxFit.cover,
                width: double.infinity,
                height: 190.0,
              ),
            ),
            if (_isFavorite != null)
              Positioned(
                top: 0,
                right: 0,
                child: IconButton(
                  iconSize: 20,
                  icon: Icon(
                    _isFavorite! ? Icons.favorite : Icons.favorite_border,
                    color: theme.secondary0,
                  ),
                  onPressed: () => setState(() {
                    _isFavorite = !_isFavorite!;
                  }),
                ),
              )
          ],
        ),
      );
    }).toList();
    // log.e('images=${widget.imageList}');

    return GestureDetector(
      onTap: () => widget.onTap(),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Stack(alignment: Alignment.bottomCenter, children: [
            images != null
                ? CarouselSlider(
                    items: images,
                    carouselController: _controller,
                    options: CarouselOptions(
                        autoPlay: false,
                        viewportFraction: 1,
                        aspectRatio: 1.81,
                        onPageChanged: (index, reason) {
                          setState(() {
                            _current = index;
                          });
                        }),
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
            if (images != null && images.length > 1)
              Positioned(
                bottom: 8.0,
                child: Padding(
                  padding: const EdgeInsets.symmetric(vertical: 12),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children:
                        (widget.imageList ?? []).asMap().entries.map((entry) {
                      return GestureDetector(
                        onTap: () => _controller.animateToPage(entry.key),
                        child: Container(
                          width: 4.0,
                          height: 4.0,
                          margin: EdgeInsets.symmetric(
                              vertical: 8.0, horizontal: 4.0),
                          decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              color: theme.secondary40.withOpacity(
                                  _current == entry.key ? 0.9 : 0.4)),
                        ),
                      );
                    }).toList(),
                  ),
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
    if (widget.distanceInKm != null) {
      sb.write('${widget.distanceInKm!.toStringAsFixed(2)} km');
    }
    sb.write(' ');
    sb.write(trans('selectUnit.distance'));
    return sb.toString();
  }
}
