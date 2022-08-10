import '/core/core.dart';
import '/core/theme/theme.dart';
import '/models.dart';
import '/modules/menu/menu.dart';
import '/shared/locale.dart';
import '/shared/utils/format_utils.dart';
import 'package:flutter/material.dart';
import '/graphql/generated/crud-api.dart';
import '/shared/nav.dart';

// Representing each sandwich in menu list (Menu page)
class ProductMenuItemWidget extends StatelessWidget {
  final Unit unit;
  final Product item;
  final ProductItemDisplayState displayState;
  final ServingMode servingMode;

  final double _disabled_opacity = 0.5;

  const ProductMenuItemWidget({
    required this.item,
    required this.unit,
    required this.displayState,
    required this.servingMode,
  });

  @override
  Widget build(BuildContext context) {
    // log.d('ProductMenuItem.servingMode=$servingMode');
    final double heightContainer = 80;
    final double widthContainer = 80;
    if (displayState == ProductItemDisplayState.HIDDEN) {
      return Container();
    }

    return Column(
      children: [
        InkWell(
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
              left: 8.0,
              right: 8.0,
            ),
            decoration: BoxDecoration(
              color: isDisabled
                  ? theme.secondary0.withOpacity(_disabled_opacity)
                  : theme.secondary0,
            ),
            child: Container(
              padding: EdgeInsets.all(8.0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.start,
                children: <Widget>[
                  Expanded(
                    child: Container(
                      padding: EdgeInsets.only(right: 12, top: 0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        mainAxisAlignment: MainAxisAlignment.start,
                        children: <Widget>[
                          Padding(
                            padding: const EdgeInsets.only(
                              bottom: 0.0,
                            ),
                            child: Text(
                              getLocalizedText(context, item.name),
                              overflow: TextOverflow.ellipsis,
                              maxLines: 2,
                              style: Fonts.hH4(
                                color: displayState ==
                                        ProductItemDisplayState.DISABLED
                                    ? theme.secondary
                                        .withOpacity(_disabled_opacity)
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
                            style: Fonts.pP2(
                              color: isDisabled
                                  ? theme.secondary
                                      .withOpacity(_disabled_opacity)
                                  : theme.secondary,
                            ),
                          ),
                          Padding(
                            padding: const EdgeInsets.only(
                              top: 8.0,
                            ),
                            child: isDisabled
                                ? _buildNotAvailableInfo(context)
                                : _buildVariantsInfo(context, theme,
                                    item.variants, unit.currency),
                          ),
                        ],
                      ),
                    ),
                  ),
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
                ],
              ),
            ),
          ),
        ),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16.0),
          child: Divider(
            height: 1.0,
            color: theme.secondary12,
          ),
        ),
      ],
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
      style: Fonts.hH5(
        color: isDisabled
            ? theme.highlight.withOpacity(_disabled_opacity)
            : theme.highlight,
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
        style: Fonts.hH5(
          color: isDisabled
              ? theme.highlight.withOpacity(_disabled_opacity)
              : theme.highlight,
        ),
      );
    } else {
      return Text(
        '${formatCurrency(prices.first, currency)} - ${formatCurrency(prices.last, currency)}',
        style: Fonts.hH5(
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
