import 'package:expandable/expandable.dart';
import 'package:fa_prev/core/theme/theme.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/menu/menu.dart';
import 'package:fa_prev/modules/menu/widgets/allergens_widget.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/shared/utils/format_utils.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

typedef OnModifiersSelected = void Function(Map<String, String> selectedModifiers);

class ProductConfigModifiersWidget extends StatefulWidget {
  final GeneratedProduct product;
  final GeoUnit unit;
  final OnModifiersSelected onModifiersSelected;

  const ProductConfigModifiersWidget({
    Key key,
    this.product,
    this.unit,
    this.onModifiersSelected,
  }) : super(key: key);

  @override
  _ProductConfigModifiersWidgetState createState() => _ProductConfigModifiersWidgetState();
}

class _ProductConfigModifiersWidgetState extends State<ProductConfigModifiersWidget> {
  Map<String, ExpandableController> _expandableModifierController = {};
  Map<String, String> _selectedModifier = {};

  @override
  void initState() {
    super.initState();

    _initDefaultSelections();
  }

  void _initDefaultSelections() {
    widget.product.configSets.forEach((modifier) {
      if (modifier.type == ConfigType.MODIFIER) {
        _selectedModifier[modifier.productSetId] = modifier.items.first.productComponentId;
        _expandableModifierController[modifier.productSetId] = ExpandableController(initialExpanded: false);
      }
    });
  }

  @override
  void dispose() {
    _expandableModifierController.values.map((expendableController) => expendableController.dispose());
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: _buildModifiers(context, widget.product.configSets),
    );
  }

  List<Widget> _buildModifiers(BuildContext context, List<GeneratedProductConfigSet> sets) {
    List<Widget> widgets = [];
    sets.forEach((modifier) {
      if (modifier.type == ConfigType.MODIFIER) {
        widgets.add(Container(
          padding: EdgeInsets.only(bottom: 16),
          child: ExpandablePanel(
            controller: _expandableModifierController[modifier.productSetId],
            header: Text(
              getLocalizedText(context, modifier.name),
              style: GoogleFonts.poppins(
                color: theme.text,
                fontSize: 20.0,
              ),
            ),
            collapsed: Column(
              mainAxisAlignment: MainAxisAlignment.start,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  getLocalizedText(
                    context,
                    getComponentByIdFromSet(_selectedModifier[modifier.productSetId], modifier).name,
                  ),
                  softWrap: true,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: GoogleFonts.poppins(
                    color: theme.text,
                    fontSize: 16.0,
                  ),
                ),
              ],
            ),
            expanded: _buildModifiersList(context, modifier.productSetId, modifier.items),
          ),
        ));
      }
    });

    return widgets;
  }

  Widget _buildModifiersList(BuildContext context, String productSetId, List<GeneratedProductConfigComponent> items) {
    List<Widget> widgets = [];
    for (int i = 0; i < items.length; i++) {
      widgets.add(_buildModifierListItem(context, items[i], productSetId, items[i].productComponentId));
    }
    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(
          14.0,
        ),
        border: Border.all(width: 1.5, color: theme.border2),
        color: theme.background,
      ),
      child: Column(
        children: [...widgets],
      ),
    );
  }

  Widget _buildModifierListItem(
      BuildContext context, GeneratedProductConfigComponent item, String productSetId, String value) {
    Set<String> allergenNames = {};
    if (item.allergens != null) {
      for (Allergen allergen in item?.allergens) {
        allergenNames.add(allergen.toString().split('.').last);
      }
    }

    return Container(
      padding: EdgeInsets.all(8.0),
      child: InkWell(
        hoverColor: theme.indicator,
        focusColor: theme.indicator,
        // enableFeedback: true,
        onTap: () {
          setState(() {
            _selectedModifier[productSetId] = value;
          });
          widget.onModifiersSelected(_selectedModifier);
          _expandableModifierController[productSetId].toggle();
        },
        child: Row(
          //crossAxisAlignment: CrossAxisAlignment.center,
          mainAxisAlignment: MainAxisAlignment.start,
          children: [
            Expanded(
              flex: 2,
              child: Radio<String>(
                groupValue: _selectedModifier[productSetId],
                value: value,
                activeColor: theme.indicator,
                // focusColor: theme.indicator,
                onChanged: (String value) {
                  setState(() {
                    _selectedModifier[productSetId] = value;
                  });
                  widget.onModifiersSelected(_selectedModifier);
                  _expandableModifierController[productSetId].toggle();
                },
              ),
            ),
            Expanded(
              flex: 10,
              child: Column(
               crossAxisAlignment: CrossAxisAlignment.start,
                // crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    getLocalizedText(context, item.name),
                    style: GoogleFonts.poppins(
                      color: theme.text,
                      //fontSize: 20.0,
                    ),
                  ),
                  AllergensWidget(
                    allergens: allergenNames.toList(),
                    showHeader: false,
                    size: 30.0,
                    fontSize: 10.0,
                    iconBorderRadius: 10.0,
                  ),
                  //buildAllergensListWidget(context, modifier),
                ],
              ),
            ),
            // Spacer(),
            Expanded(
              flex: 2,
              child: Container(
                child: Text(
                  formatCurrency(item.price, widget.unit.currency),
                  //getModifierItemsTotalPrice(modifier, widget.unit.currency),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
