import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/core/theme/theme.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/screens.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/shared/utils/format_utils.dart';
import 'package:fa_prev/shared/widgets.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:fa_prev/shared/nav.dart';

// Representing each sandwich in menu list (Menu page)
class ProductMenuItem extends StatelessWidget {
  final GeoUnit unit;
  final GeneratedProduct item;
  final String heroPrefix;

  ProductMenuItem({Key key, this.item, this.heroPrefix, this.unit}) : super(key: key);

  Widget build(BuildContext context) {
    return buildProductItem(context, this.unit, this.item, this.heroPrefix, theme);
  }
}

Widget buildProductItem(BuildContext context, GeoUnit unit, GeneratedProduct item, String heroPrefix, ThemeChainData theme) {
  // Defining the dimensions and shadow of each sandwich in menu list (Menu page)
  final double heightContainer = 130;
  final double widthContainer = 130;

  return InkWell(
    focusColor: theme.indicator,
    onTap: () {
      Nav.to(
          ProductDetailsScreen(
            unit: unit,
            item: item,
            heroId: '${heroPrefix}_${item.id}',
          ));
    },
    child: Container(
      margin: const EdgeInsets.only(
        top: 16.0,
        left: 12.0,
        right: 12.0,
      ),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(
          14.0,
        ),
        border: Border.all(
          width: 1,
          color: theme.border2,
        ),
        color: theme.background,
      ),
      child: Container(
        padding: EdgeInsets.all(8.0),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.start,
          children: <Widget>[
            Hero(
              tag: '${heroPrefix}_${item.id}',
              child: ImageWidget(
                url: item.image,
                width: widthContainer,
                height: heightContainer,
                placeholder: Container(
                  padding: EdgeInsets.all(50.0),
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.all(
                      Radius.circular(14.0),
                    ),
                    border: Border.all(
                      width: 1.5,
                      color: theme.border.withOpacity(0.4),
                    ),
                  ),
                  width: widthContainer,
                  height: heightContainer,
                  child: CircularProgressIndicator(
                    backgroundColor: theme.background2,
                  ),
                ),
                errorWidget: Container(
                  padding: EdgeInsets.all(50.0),
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.all(
                      Radius.circular(14.0),
                    ),
                    border: Border.all(
                      width: 1.5,
                      color: theme.border.withOpacity(0.4),
                    ),
                  ),
                  child: Icon(
                    Icons.error,
                    color: Colors.red,
                    size: 32.0,
                  ),
                ),
              ),
            ),
            Expanded(
              child: Container(
                padding: EdgeInsets.only(left: 8, top: 0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    Padding(
                      padding: const EdgeInsets.only(
                        bottom: 3.0,
                      ),
                      child: Row(
                        children: <Widget>[
                          Expanded(
                            child: Text(
                              getLocalizedText(context, item.name).toUpperCase(),
                              overflow: TextOverflow.ellipsis,
                              maxLines: 2,
                              style: GoogleFonts.poppins(
                                fontSize: 18.0,
                                fontWeight: FontWeight.bold,
                                color: theme.text,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    _buildVariantsInfo(context, theme, item.variants, unit.currency),
                    Padding(
                      padding: const EdgeInsets.only(
                        top: 12.0,
                      ),
                      child: Text(
                        getLocalizedText(context, item.description),
                        style: GoogleFonts.poppins(
                          fontSize: 11.0,
                          color: theme.text,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    ),
  );
}

Widget _buildVariantsInfo(BuildContext context, ThemeChainData theme, List<ProductVariant> variants, String currency) {
  if (variants == null) {
    return Container();
  }
  final prices = variants.map((variant) => variant.price).toList();
  prices.sort();

  if (prices.first == prices.last) {
    return Text(
      formatCurrency(prices.first, currency),
      style: GoogleFonts.poppins(
        fontSize: 14.0,
        fontWeight: FontWeight.w600,
        color: theme.highlight,
      ),
    );
  } else {
    return Text(
      '${formatCurrency(prices.first, currency)}-${formatCurrency(prices.last, currency)}',
      style: GoogleFonts.poppins(
        fontSize: 14.0,
        fontWeight: FontWeight.w600,
        color: theme.highlight,
      ),
    );
  }
}
