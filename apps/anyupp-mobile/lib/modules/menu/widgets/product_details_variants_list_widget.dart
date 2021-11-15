import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/menu/menu.dart';
import 'package:flutter/material.dart';
import 'package:fa_prev/core/theme/theme.dart';
import 'package:fa_prev/graphql/generated/crud-api.dart';

class ProductDetailVariantListWidget extends StatefulWidget {
  final GeoUnit unit;
  final GeneratedProduct product;
  final Cart? cart;
  final ServingMode? servingMode;

  const ProductDetailVariantListWidget({
    required this.unit,
    required this.product,
    required this.cart,
    required this.servingMode,
  });

  @override
  _ProductDetailVariantListWidgetState createState() => _ProductDetailVariantListWidgetState();
}

class _ProductDetailVariantListWidgetState extends State<ProductDetailVariantListWidget> {
  List<bool> expanded = [];

  @override
  Widget build(BuildContext context) {
    return Container(
      color: theme.secondary12,
      padding: const EdgeInsets.all(16),
      child: ProductConfiguratorWidget(
        product: widget.product,
        unit: widget.unit,
        servingMode: widget.servingMode,
      ),
    );
  }
}
