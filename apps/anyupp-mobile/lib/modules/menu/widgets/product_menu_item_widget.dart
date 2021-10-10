import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/core/theme/theme.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/screens.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/shared/utils/format_utils.dart';
import 'package:fa_prev/shared/widgets.dart';
import 'package:flutter/material.dart';

import 'package:fa_prev/shared/nav.dart';

// Representing each sandwich in menu list (Menu page)
class ProductMenuItem extends StatelessWidget {
  final GeoUnit unit;
  final GeneratedProduct item;

  ProductMenuItem({
    required this.item,
    required this.unit,
  });

  Widget build(BuildContext context) {
    return buildProductItem(context, this.unit, this.item, theme);
  }
}

Widget buildProductItem(BuildContext context, GeoUnit unit,
    GeneratedProduct item, ThemeChainData theme) {
  // Defining the dimensions and shadow of each sandwich in menu list (Menu page)
  final double heightContainer = 130;
  final double widthContainer = 130;

  return InkWell(
    focusColor: theme.primary,
    highlightColor: theme.secondary40,
    onTap: () {
      Nav.to(
        ProductDetailsScreen(
          unit: unit,
          item: item,
        ),
        duration: Duration(milliseconds: 400),
        animationType: NavAnim.SLIDEIN_DOWN,
      );
    },
    child: Container(
      margin: const EdgeInsets.only(
        top: 8.0,
        bottom: 8.0,
        left: 12.0,
        right: 12.0,
      ),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(
          14.0,
        ),
        border: Border.all(
          width: 1,
          color: theme.secondary0,
        ),
        color: theme.secondary0,
      ),
      child: Container(
        padding: EdgeInsets.all(8.0),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.start,
          children: <Widget>[
            ClipRRect(
              borderRadius: BorderRadius.circular(
                8.0,
              ),
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
                      color: theme.secondary16.withOpacity(0.4),
                    ),
                  ),
                  width: widthContainer,
                  height: heightContainer,
                  child: CircularProgressIndicator(
                    backgroundColor: theme.secondary12,
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
                      color: theme.secondary16.withOpacity(0.4),
                    ),
                  ),
                  border: Border.all(
                    width: 1.5,
                    color: theme.secondary16.withOpacity(0.4),
                  ),
                ),
                child: Icon(
                  Icons.error,
                  color: Colors.red,
                  size: 32.0,
                ),
              ),
            ),
            Expanded(
              child: Container(
                padding: EdgeInsets.only(left: 8, top: 0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.start,
                  children: <Widget>[
                    Padding(
                      padding: const EdgeInsets.only(
                        bottom: 3.0,
                      ),
                      child: Text(
                        getLocalizedText(context, item.name),
                        overflow: TextOverflow.ellipsis,
                        maxLines: 2,
                        style: Fonts.satoshi(
                          fontSize: 18.0,
                          fontWeight: FontWeight.w700,
                          color: theme.secondary,
                        ),
                      ),
                    ),
                    Text(
                      item.description == null
                          ? ''
                          : getLocalizedText(context, item.description!),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: Fonts.satoshi(
                        fontSize: 14.0,
                        color: theme.secondary,
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.only(
                        top: 20.0,
                      ),
                      child: _buildVariantsInfo(
                          context, theme, item.variants, unit.currency),
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

Widget _buildVariantsInfo(BuildContext context, ThemeChainData theme,
    List<ProductVariant> variants, String currency) {
  final prices = variants.map((variant) => variant.price).toList();
  prices.sort();

  if (prices.first == prices.last) {
    return Text(
      formatCurrency(prices.first, currency),
      style: Fonts.satoshi(
        fontSize: 14.0,
        fontWeight: FontWeight.w700,
        color: theme.primary,
      ),
    );
  } else {
    return Text(
      '${formatCurrency(prices.first, currency)} - ${formatCurrency(prices.last, currency)}',
      style: Fonts.satoshi(
        fontSize: 14.0,
        fontWeight: FontWeight.w700,
        color: theme.primary,
      ),
    );
  }
}
