import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/core/theme/theme.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/menu/menu.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/shared/utils/format_utils.dart';
import 'package:fa_prev/shared/utils/unit_utils.dart';
import 'package:flutter/material.dart';
import 'package:fa_prev/graphql/generated/crud-api.dart';
import 'package:fa_prev/shared/nav.dart';

// Representing each sandwich in menu list (Menu page)
class ProductMenuItem extends StatelessWidget {
  final GeoUnit unit;
  final GeneratedProduct item;
  final ProductItemDisplayState displayState;
  final ServingMode servingMode;

  final double _disabled_opacity = 0.5;

  ProductMenuItem({
    required this.item,
    required this.unit,
    required this.displayState,
    required this.servingMode,
  });

  @override
  Widget build(BuildContext context) {
    // print('ProductMenuItem.servingMode=$servingMode');
    final double heightContainer = 130;
    final double widthContainer = 130;

    return InkWell(
      focusColor: theme.highlight,
      highlightColor: theme.secondary40,
      onTap: () {
        Nav.to(
          ProductDetailsScreen(
            unit: unit,
            item: item,
            displayState: displayState,
            servingMode: servingMode,
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
            color: isDisabled
                ? theme.secondary0.withOpacity(_disabled_opacity)
                : theme.secondary0,
          ),
          color: isDisabled
              ? theme.secondary0.withOpacity(_disabled_opacity)
              : theme.secondary0,
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
                child: isDisabled
                    ? ColorFiltered(
                        colorFilter: ColorFilter.mode(
                            Colors.black.withOpacity(_disabled_opacity),
                            BlendMode.dstIn),
                        child: ProductImageWidget(
                          url: item.image!,
                          width: widthContainer,
                          height: heightContainer,
                        ),
                      )
                    : ProductImageWidget(
                        url: item.image!,
                        width: widthContainer,
                        height: heightContainer,
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
                            color: displayState ==
                                    ProductItemDisplayState.DISABLED
                                ? theme.secondary.withOpacity(_disabled_opacity)
                                : theme.secondary,
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
                          fontWeight: FontWeight.w400,
                          color: isDisabled
                              ? theme.secondary.withOpacity(_disabled_opacity)
                              : theme.secondary,
                        ),
                      ),
                      Padding(
                        padding: const EdgeInsets.only(
                          top: 20.0,
                        ),
                        child: isDisabled
                            ? _buildNotAvailableInfo(context)
                            : _buildVariantsInfo(
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

  Widget _buildNotAvailableInfo(BuildContext context) {
    late String desc;
    if (displayState == ProductItemDisplayState.SOLDOUT) {
      desc = trans(context, 'product.soldOut');
    } else if (displayState == ProductItemDisplayState.DISABLED) {
      if (servingMode == ServingMode.takeAway) {
        desc = trans(context, 'product.notTakeAway');
      } else {
        desc = trans(context, 'product.notInPlace');
      }
    }

    return Text(
      desc,
      style: Fonts.satoshi(
        fontSize: 14.0,
        fontWeight: FontWeight.w700,
        color: isDisabled
            ? theme.highlight.withOpacity(_disabled_opacity)
            : theme.highlight,
      ),
    );
  }

  Widget _buildVariantsInfo(BuildContext context, ThemeChainData theme,
      List<ProductVariant> variants, String currency) {
    final prices =
        variants.map((variant) => variant.price * serviceFeeMul).toList();
    prices.sort();

    if (prices.first == prices.last) {
      return Text(
        formatCurrency(prices.first, currency),
        style: Fonts.satoshi(
          fontSize: 14.0,
          fontWeight: FontWeight.w700,
          color: isDisabled
              ? theme.highlight.withOpacity(_disabled_opacity)
              : theme.highlight,
        ),
      );
    } else {
      return Text(
        '${formatCurrency(prices.first, currency)} - ${formatCurrency(prices.last, currency)}',
        style: Fonts.satoshi(
          fontSize: 14.0,
          fontWeight: FontWeight.w700,
          color: isDisabled
              ? theme.highlight.withOpacity(_disabled_opacity)
              : theme.highlight,
        ),
      );
    }
  }

  // helpers

  bool get isDisabled =>
      displayState == ProductItemDisplayState.DISABLED ||
      displayState == ProductItemDisplayState.SOLDOUT;
  bool get isSoldOut => displayState == ProductItemDisplayState.SOLDOUT;
}
