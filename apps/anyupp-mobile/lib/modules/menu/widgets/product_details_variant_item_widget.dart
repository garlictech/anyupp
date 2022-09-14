import '/core/theme/theme.dart';
import '/models.dart';
import '/shared/locale.dart';
import 'package:flutter/material.dart';

class ProductDetailVariantItemWidget extends StatelessWidget {
  final Unit unit;
  final Product product;
  final ProductVariant variant;
  final Widget? child;

  const ProductDetailVariantItemWidget({
    required this.unit,
    required this.product,
    required this.variant,
    this.child,
  });
  @override
  Widget build(BuildContext context) {
    return Container(
      //height: 76,
      margin: EdgeInsets.only(top: 10, bottom: 10),
      decoration: BoxDecoration(
        color: theme.secondary12,
        boxShadow: [
          BoxShadow(
            color: !theme.light ? Color.fromARGB(5, 0, 0, 0) : Color.fromARGB(5, 255, 255, 255),
            offset: Offset(0, 0),
            blurRadius: 20,
          ),
        ],
        borderRadius: BorderRadius.all(
          Radius.circular(12),
        ),
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
//            flex: 65,
                child: Container(
                  margin: EdgeInsets.only(left: 22, top: 5, bottom: 5, right: 8),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        getLocalizedText(context, variant.variantName),
                        textAlign: TextAlign.left,
                        overflow: TextOverflow.ellipsis,
                        maxLines: 1,
                        style: Fonts.satoshi(
                          color: theme.secondary,
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                        ),
                      ),
                      if (variant.pack != null && variant.pack!.size > 0.0)
                        Container(
                          margin: EdgeInsets.only(top: 4),
                          child: Text(
                            '${variant.pack!.size} ${variant.pack!.unit}',
                            textAlign: TextAlign.left,
                            style: Fonts.satoshi(
                              color: theme.highlight,
                              fontWeight: FontWeight.w500,
                              fontSize: 12,
                            ),
                          ),
                        ),
                    ],
                  ),
                ),
              ),
              if (child != null) child!
            ],
          ),
        ],
      ),
    );
  }
}
