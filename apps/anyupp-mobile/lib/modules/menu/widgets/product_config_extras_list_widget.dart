import 'package:anyupp/models/ProductComponent.dart';

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
  final List<ProductComponentSet> componentSets;
  final List<ProductComponent> components;

  const ProductConfigExtrasWidget(
      {required this.product,
      required this.unit,
      required this.onExtraSelected,
      required this.componentSets,
      required this.components});

  @override
  _ProductConfigExtrasWidgetState createState() =>
      _ProductConfigExtrasWidgetState();
}

class _ProductConfigExtrasWidgetState extends State<ProductConfigExtrasWidget> {
  @override
  Widget build(BuildContext context) {
    return _buildExtraSets(context, widget.componentSets);
  }

  Widget _buildExtraSets(
      BuildContext context, List<ProductComponentSet>? extras) {
    ServingMode? mode = takeAwayMode;

    List<Widget> widgets = [];
    for (int i = 0; extras != null && i < extras.length; i++) {
      final ProductConfigSet configSet = (widget.product.configSets ?? [])
          .firstWhere((set) => set.productSetId == extras[i].id);

      if (extras[i].type == ProductComponentSetType.extras &&
          (extras[i].supportedServingModes?.contains(mode) ?? false)) {
        widgets.add(Container(
          margin: EdgeInsets.only(bottom: (i != extras.length - 1 ? 16.0 : 0)),
          child: ProductConfigExtrasItemWidget(
              extraSet: extras[i],
              configSet: configSet,
              unit: widget.unit,
              onExtraSelected: widget.onExtraSelected,
              components: widget.components),
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
