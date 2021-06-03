import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/menu/menu.dart';
import 'package:flutter/material.dart';

typedef OnExtraSetItemSelected = void Function(String extraSetId, String extraComponentId, bool selected);

class ProductConfigExtrasWidget extends StatefulWidget {
  final GeneratedProduct product;
  final GeoUnit unit;
  final OnExtraSetItemSelected onExtraSelected;

  const ProductConfigExtrasWidget({Key key, this.product, this.unit, this.onExtraSelected}) : super(key: key);

  @override
  _ProductConfigExtrasWidgetState createState() => _ProductConfigExtrasWidgetState();
}

class _ProductConfigExtrasWidgetState extends State<ProductConfigExtrasWidget> {
  @override
  Widget build(BuildContext context) {
    return _buildExtraSets(context, widget.product.configSets);
  }

  Widget _buildExtraSets(BuildContext context, List<GeneratedProductConfigSet> extras) {
    List<Widget> widgets = [];
    for (int i = 0; i < extras.length; i++) {
      if (extras[i].type == ConfigType.EXTRA) {
        widgets.add(ProductConfigExtrasItemWidget(
          extraSet: extras[i],
          unit: widget.unit,
          onExtraSelected: widget.onExtraSelected,
        ));
      }
    }
    return Container(
      child: Column(
        children: widgets,
      ),
    );
  }
}
