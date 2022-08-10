import '/models.dart';
import '/modules/menu/menu.dart';
import '/modules/takeaway/takeaway.dart';
import 'package:flutter/material.dart';
import '/graphql/generated/crud-api.dart';

typedef OnExtraSetItemSelected = void Function(
    String extraSetId, String extraComponentId, bool selected);

class ProductConfigExtrasWidget extends StatefulWidget {
  final Product product;
  final Unit unit;
  final OnExtraSetItemSelected onExtraSelected;

  const ProductConfigExtrasWidget(
      {required this.product,
      required this.unit,
      required this.onExtraSelected});

  @override
  _ProductConfigExtrasWidgetState createState() =>
      _ProductConfigExtrasWidgetState();
}

class _ProductConfigExtrasWidgetState extends State<ProductConfigExtrasWidget> {
  @override
  Widget build(BuildContext context) {
    return _buildExtraSets(context, widget.product.configSets);
  }

  Widget _buildExtraSets(
      BuildContext context, List<ProductConfigSet>? extras) {
    ServingMode? mode = takeAwayMode;

    List<Widget> widgets = [];
    for (int i = 0; extras != null && i < extras.length; i++) {
      if (extras[i].type == ProductComponentSetType.extras &&
          extras[i].supportedServingModes.contains(mode)) {
        widgets.add(Container(
          margin: EdgeInsets.only(bottom: (i != extras.length - 1 ? 16.0 : 0)),
          child: ProductConfigExtrasItemWidget(
            extraSet: extras[i],
            unit: widget.unit,
            onExtraSelected: widget.onExtraSelected,
          ),
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
