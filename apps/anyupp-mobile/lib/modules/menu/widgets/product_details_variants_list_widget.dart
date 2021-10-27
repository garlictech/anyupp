import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/menu/menu.dart';
import 'package:flutter/material.dart';
import 'package:fa_prev/core/theme/theme.dart';

class ProductDetailVariantListWidget extends StatefulWidget {
  final GeoUnit unit;
  final GeneratedProduct product;
  final Cart? cart;

  const ProductDetailVariantListWidget({
    required this.unit,
    required this.product,
    required this.cart,
  });

  @override
  _ProductDetailVariantListWidgetState createState() => _ProductDetailVariantListWidgetState();
}

class _ProductDetailVariantListWidgetState extends State<ProductDetailVariantListWidget> {
  List<bool> expanded = [];

  @override
  Widget build(BuildContext context) {
    if (widget.product.configSets == null ||
        (widget.product.configSets != null && widget.product.configSets!.isEmpty)) {
      return _buildWithNormalPanel(context);
    } else {
      return Container(
        color: theme.secondary12,
        padding: const EdgeInsets.all(16),
        child: ProductConfiguratorWidget(
          product: widget.product,
          unit: widget.unit,
        ),
      );
    }
  }

  Widget _buildWithNormalPanel(BuildContext context) {
    List<ProductVariant> variants = widget.product.variants;
    if (variants.isEmpty) {
      return Container();
    }

    List<Widget> items = [];
    variants.forEach((variant) {
      items.add(Container(
        padding: EdgeInsets.symmetric(horizontal: 16),
        child: ProductDetailVariantItemWidget(
          unit: widget.unit,
          product: widget.product,
          variant: variant,
          child: AddVariantWidget(
            unit: widget.unit,
            cart: widget.cart,
            product: widget.product,
            variant: variant,
          ),
        ),
      ));
    });
    if (widget.product.allergens != null &&
        (widget.product.allergens != null && widget.product.allergens!.isNotEmpty)) {
      items.add(Padding(
        padding: const EdgeInsets.only(
          left: 16,
          right: 16,
        ),
        child: AllergensWidget(allergens: widget.product.allergens!),
      ));
    }
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: items,
    );
  }
}
