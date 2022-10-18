import 'package:anyupp/models/ProductComponent.dart';
import 'package:expandable/expandable.dart';
import '/core/theme/theme.dart';
import '/models.dart';
import '/modules/menu/menu.dart';
import '/modules/takeaway/takeaway.dart';
import '/shared/locale.dart';
import '/shared/utils/format_utils.dart';
import '/shared/utils/unit_utils.dart';
import 'package:flutter/material.dart';
import '/graphql/generated/crud-api.dart';

typedef OnModifiersSelected = void Function(
    Map<String, String> selectedModifiers);

class ProductConfigModifiersWidget extends StatefulWidget {
  final Product product;
  final Unit unit;
  final OnModifiersSelected onModifiersSelected;
  final ProductItemDisplayState displayState;
  final List<ProductComponentSet> componentSets;
  final List<ProductComponent> components;

  const ProductConfigModifiersWidget(
      {required this.product,
      required this.unit,
      required this.onModifiersSelected,
      required this.displayState,
      required this.componentSets,
      required this.components});

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

    widget.componentSets.forEach((modifier) {
      final configSet = (widget.product.configSets ?? [])
          .firstWhere((set) => set.productSetId == modifier.id);
      if (modifier.type == ProductComponentSetType.modifier &&
          (modifier.supportedServingModes?.contains(mode) ?? false)) {
        if (_shouldDisplayConfigSet(configSet)) {
          _selectedModifier[modifier.id] = modifier.items.first;
          _expandableModifierController[modifier.id] =
              ExpandableController(initialExpanded: false);
        }
      }
    });
  }

  bool _shouldDisplayConfigSet(ProductConfigSet configSet) {
    bool display = configSet.items.isNotEmpty;
    if (widget.unit.soldOutVisibilityPolicy != null) {
      int visibleItemCount = configSet.items.fold(
          0,
          (previousValue, component) =>
              previousValue + ((component.soldOut ?? false) ? 0 : 1));
      display = display && visibleItemCount > 0;
    }
    return display;
  }

  bool _shouldDisplayConfigComponent(ProductConfigComponent component) {
    return widget.unit.soldOutVisibilityPolicy != null
        ? !(component.soldOut ?? false)
        : true;
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
      BuildContext context, List<ProductConfigSet>? sets) {
    List<Widget> widgets = [];
    ServingMode? mode = takeAwayMode;
    sets?.forEach((modifier) {
      final componentSet = widget.componentSets
          .firstWhere((set) => set.id == modifier.productSetId);

      if (_shouldDisplayConfigSet(modifier) &&
          componentSet.type == ProductComponentSetType.modifier &&
          (componentSet.supportedServingModes?.contains(mode) ?? false)) {
        widgets.add(_buildSingleModifier(modifier));
      }
    });

    return widgets;
  }

  Widget _buildSingleModifier(ProductConfigSet modifier) {
    final ProductComponentSet componentSet = widget.componentSets
        .firstWhere((set) => set.id == modifier.productSetId);

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
                getLocalizedText(context, componentSet.name),
                style: Fonts.satoshi(
                  color: theme.highlight,
                  fontSize: 14,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ),
            Divider(
              color: theme.secondary16,
            ),
            ..._buildModifiersList(
                context,
                modifier.productSetId,
                modifier.items
                    .where(
                        (component) => _shouldDisplayConfigComponent(component))
                    .toList()),
          ],
        ),
      ),
    );
  }

  List<Widget> _buildModifiersList(BuildContext context, String productSetId,
      List<ProductConfigComponent> items) {
    List<Widget> widgets = [];
    for (int i = 0; i < items.length; i++) {
      widgets.add(_buildModifierListItem(context, items[i], productSetId,
          items[i].productComponentId, i == items.length - 1));
    }
    return widgets;
  }

  Widget _buildModifierListItem(
    BuildContext context,
    ProductConfigComponent item,
    String productSetId,
    String value,
    bool last,
  ) {
    Set<String> allergenNames = {};
    final ProductComponent component = widget.components
        .firstWhere((cmp) => cmp.id == item.productComponentId);

    if (component.allergens != null) {
      for (Allergen allergen in component.allergens!) {
        allergenNames.add(allergen.toString().split('.').last);
      }
    }

    return Container(
      child: InkWell(
        hoverColor: theme.highlight,
        focusColor: theme.highlight,
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
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsets.only(left: 16),
              child: ClipRect(
                child: Row(
                  children: [
                    Expanded(
                      child: Text(
                        getLocalizedText(context, component.name),
                        style: Fonts.satoshi(
                          color: theme.secondary,
                          fontSize: 16.0,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ),
                    Row(
                      children: [
                        Text(
                          (item.price > 0 ? '+' : '') +
                              formatCurrency(item.price * serviceFeeMul,
                                  widget.unit.currency),
                          style: Fonts.satoshi(
                            color: theme.highlight,
                            fontSize: 16.0,
                            fontWeight: FontWeight.w400,
                          ),
                        ),
                        Radio<String>(
                          groupValue: _selectedModifier[productSetId],
                          value: value,
                          activeColor: theme.highlight,
                          fillColor: MaterialStateColor.resolveWith((states) {
                            if (states.isEmpty) {
                              return theme.secondary16;
                            }
                            var state = states.first;
                            switch (state) {
                              case MaterialState.selected:
                                return theme.highlight;
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
