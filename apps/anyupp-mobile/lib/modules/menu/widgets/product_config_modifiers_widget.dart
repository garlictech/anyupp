import 'package:expandable/expandable.dart';
import 'package:fa_prev/core/theme/theme.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/menu/menu.dart';
import 'package:fa_prev/modules/takeaway/takeaway.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/shared/utils/format_utils.dart';
import 'package:flutter/material.dart';
import 'package:fa_prev/graphql/generated/crud-api.dart' hide Allergen;

typedef OnModifiersSelected = void Function(
    Map<String, String> selectedModifiers);

class ProductConfigModifiersWidget extends StatefulWidget {
  final GeneratedProduct product;
  final GeoUnit unit;
  final OnModifiersSelected onModifiersSelected;

  const ProductConfigModifiersWidget({
    required this.product,
    required this.unit,
    required this.onModifiersSelected,
  });

  @override
  _ProductConfigModifiersWidgetState createState() =>
      _ProductConfigModifiersWidgetState();
}

class _ProductConfigModifiersWidgetState
    extends State<ProductConfigModifiersWidget> {
  Map<String, ExpandableController> _expandableModifierController = {};
  Map<String, String> _selectedModifier = {};

  @override
  void initState() {
    super.initState();

    _initDefaultSelections();
  }

  void _initDefaultSelections() {
    ServingMode? mode = takeAwayMode;

    widget.product.configSets?.forEach((modifier) {
      if (modifier.type == ConfigType.MODIFIER &&
          modifier.supportedServingModes.contains(mode)) {
        _selectedModifier[modifier.productSetId] =
            modifier.items.first.productComponentId;
        _expandableModifierController[modifier.productSetId] =
            ExpandableController(initialExpanded: false);
      }
    });
  }

  @override
  void dispose() {
    _expandableModifierController.values
        .map((expendableController) => expendableController.dispose());
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.start,
      children: _buildModifiers(context, widget.product.configSets),
    );
  }

  List<Widget> _buildModifiers(
      BuildContext context, List<GeneratedProductConfigSet>? sets) {
    List<Widget> widgets = [];
    ServingMode? mode = takeAwayMode;
    sets?.forEach((modifier) {
      if (modifier.type == ConfigType.MODIFIER &&
          modifier.supportedServingModes.contains(mode)) {
        widgets.add(_buildSingleModifier(modifier));
      }
    });

    return widgets;
  }

  Widget _buildSingleModifier(GeneratedProductConfigSet modifier) {
    return Container(
      margin: EdgeInsets.only(bottom: 16.0),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.all(
          Radius.circular(
            16.0,
          ),
        ),
        color: theme.secondary0,
      ),
      child: Container(
        width: double.infinity,
        padding: EdgeInsets.only(
          top: 12.0,
          // left: 16.0,
          bottom: 12.0,
          // right: 16.0,
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.start,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsets.only(left: 16),
              child: Text(
                getLocalizedText(context, modifier.name),
                style: Fonts.satoshi(
                  color: theme.primary,
                  fontSize: 14,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ),
            Divider(
              color: theme.secondary16,
            ),
            ..._buildModifiersList(
                context, modifier.productSetId, modifier.items),
          ],
        ),
      ),
    );
  }

  List<Widget> _buildModifiersList(BuildContext context, String productSetId,
      List<GeneratedProductConfigComponent> items) {
    List<Widget> widgets = [];
    for (int i = 0; i < items.length; i++) {
      widgets.add(_buildModifierListItem(context, items[i], productSetId,
          items[i].productComponentId, i == items.length - 1));
    }
    return widgets;
  }

  Widget _buildModifierListItem(
    BuildContext context,
    GeneratedProductConfigComponent item,
    String productSetId,
    String value,
    bool last,
  ) {
    Set<String> allergenNames = {};
    if (item.allergens != null) {
      for (Allergen allergen in item.allergens!) {
        allergenNames.add(allergen.toString().split('.').last);
      }
    }

    return Container(
      child: InkWell(
        hoverColor: theme.primary,
        focusColor: theme.primary,
        enableFeedback: true,
        onTap: () {
          setState(() {
            _selectedModifier[productSetId] = value;
          });
          widget.onModifiersSelected(_selectedModifier);
          _expandableModifierController[productSetId]?.toggle();
        },
        child: Column(
          mainAxisAlignment: MainAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsets.only(left: 16),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    getLocalizedText(context, item.name),
                    style: Fonts.satoshi(
                      color: theme.secondary,
                      fontSize: 16.0,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  Row(
                    children: [
                      Text(
                        (item.price > 0 ? '+' : '') +
                            formatCurrency(item.price, widget.unit.currency),
                        style: Fonts.satoshi(
                          color: theme.primary,
                          fontSize: 16.0,
                          fontWeight: FontWeight.w400,
                        ),
                      ),
                      Radio<String>(
                        groupValue: _selectedModifier[productSetId],
                        value: value,
                        activeColor: theme.primary,
                        fillColor: MaterialStateColor.resolveWith((states) {
                          if (states.isEmpty) {
                            return theme.secondary16;
                          }
                          var state = states.first;
                          switch (state) {
                            case MaterialState.selected:
                              return theme.primary;
                            default:
                              return theme.secondary16;
                          }
                        }),
                        onChanged: (String? value) {
                          if (value != null) {
                            setState(() {
                              _selectedModifier[productSetId] = value;
                            });
                            widget.onModifiersSelected(_selectedModifier);
                            _expandableModifierController[productSetId]
                                ?.toggle();
                          }
                        },
                      ),
                    ],
                  ),
                ],
              ),
            ),
            if (!last)
              Divider(
                height: 1,
                color: theme.secondary12,
              )
          ],
        ),
      ),
    );
  }
}
