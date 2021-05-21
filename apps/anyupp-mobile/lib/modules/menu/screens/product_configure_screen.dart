import 'dart:math';

import 'package:expandable/expandable.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/menu/menu.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/shared/nav.dart';
import 'package:flutter/material.dart';
import 'package:fa_prev/core/theme/theme.dart';
import 'package:google_fonts/google_fonts.dart';

class ProductConfiguratorScreen extends StatefulWidget {
  final GeoUnit unit;
  final GeneratedProduct product;
  final Cart cart;

  const ProductConfiguratorScreen({Key key, this.unit, this.product, this.cart}) : super(key: key);

  @override
  _ProductConfiguratorScreenState createState() => _ProductConfiguratorScreenState();
}

class _ProductConfiguratorScreenState extends State<ProductConfiguratorScreen> {
  int _selectedModifier = 0;
  ExpandableController _expandableModifierController;
  Map<String, bool> _selectedExtras = {};
  Map<String, int> _selectedExtraCount = {};
  double _modifierTotalPrice = 0.0;

  @override
  void initState() {
    super.initState();
    _expandableModifierController = ExpandableController(initialExpanded: false);
  }

  @override
  void dispose() {
    _expandableModifierController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    List<GeneratedProductConfigSet> sets = widget.product.configSets;
    sets.sort((a, b) => a.position - b.position);

    return SafeArea(
      child: Scaffold(
        backgroundColor: theme.background,
        appBar: AppBar(
          leading: Container(
            padding: EdgeInsets.only(
              left: 8.0,
              top: 4.0,
              bottom: 4.0,
            ),
            child: Container(
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(10),
                border: Border.all(
                  width: 1,
                  color: theme.border2,
                ),
              ),
              child: BackButton(
                onPressed: () => Nav.pop(),
                color: theme.text,
              ),
            ),
          ),
          elevation: 0.0,
          iconTheme: IconThemeData(
            color: theme.text, //change your color here
          ),
          backgroundColor: theme.background,
          title: Text(
            getLocalizedText(context, widget.product.name),
            style: GoogleFonts.poppins(color: theme.text, fontSize: 18.0),
          ),
        ),
        body: SingleChildScrollView(
          physics: BouncingScrollPhysics(),
          child: Container(
            padding: EdgeInsets.all(8.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildTotalSummary(context),
                _buildModifiers(context, sets),
                SizedBox(
                  height: 16.0,
                ),
                _buildExtraSets(context, sets),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildTotalSummary(BuildContext context) {
    return Container(
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Total',
                style: GoogleFonts.poppins(
                  fontSize: 30.0,
                  color: theme.text,
                ),
              ),
              Text(
                formatCurrencyWithSignal(_modifierTotalPrice, widget.unit.currency),
                style: GoogleFonts.poppins(
                  fontSize: 30.0,
                  color: theme.text,
                ),
              ),
            ],
          ),
          Divider(
            color: theme.border2,
          ),
          SizedBox(
            height: 16.0,
          )
        ],
      ),
    );
  }

  Widget _buildModifiers(BuildContext context, List<GeneratedProductConfigSet> sets) {
    return ExpandablePanel(
      controller: _expandableModifierController,
      header: Text(
        getLocalizedText(context, sets[_selectedModifier].name),
        style: GoogleFonts.poppins(
          color: theme.text,
          fontSize: 24.0,
        ),
      ),
      collapsed: Column(
        mainAxisAlignment: MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            getDetailsTextFromModifierSet(context, sets[_selectedModifier]),
            // '#' + getLocalizedText(context, sets[_selectedModifier].name),
            softWrap: true,
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
            style: GoogleFonts.poppins(
              color: theme.text,
              fontSize: 12.0,
            ),
          ),
          buildAllergensListWidget(context, sets[_selectedModifier]),
        ],
      ),
      expanded: _buildModifiersList(context, sets),
    );
  }

  Widget _buildModifiersList(BuildContext context, List<GeneratedProductConfigSet> modifiers) {
    List<Widget> widgets = [];
    for (int i = 0; i < modifiers.length; i++) {
      if (modifiers[i].type == ConfigType.MODIFIER) {
        widgets.add(_buildSingleModifier(context, modifiers[i], modifiers[i].position, false));
      }
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

  Widget _buildSingleModifier(BuildContext context, GeneratedProductConfigSet modifier, int value, bool last) {
    return Container(
      padding: EdgeInsets.all(8.0),
      child: InkWell(
        hoverColor: theme.indicator,
        focusColor: theme.indicator,
        // enableFeedback: true,
        onTap: () {
          setState(() {
            _selectedModifier = value;
          });
          _calculateTotalPrice();
          _expandableModifierController.toggle();
        },
        child: Row(
          //crossAxisAlignment: CrossAxisAlignment.center,
          mainAxisAlignment: MainAxisAlignment.start,
          children: [
            Radio<int>(
              groupValue: _selectedModifier,
              value: value,
              activeColor: theme.indicator,
              // focusColor: theme.indicator,
              onChanged: (int value) {
                setState(() {
                  _selectedModifier = value;
                });
                _calculateTotalPrice();
                _expandableModifierController.toggle();
              },
            ),
            Expanded(
              child: Container(
                child: Wrap(
                  direction: Axis.vertical,
                  // crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      getLocalizedText(context, modifier.name),
                      style: GoogleFonts.poppins(
                        color: theme.text,
                        fontSize: 24.0,
                      ),
                    ),
                    Text(
                      getDetailsTextFromModifierSet(context, modifier),
                      // '#' + getLocalizedText(context, sets[_selectedModifier].name),
                      softWrap: true,
                      maxLines: 2,
                      overflow: TextOverflow.fade,
                      style: GoogleFonts.poppins(
                        color: theme.text,
                        fontSize: 12.0,
                      ),
                    ),
                    //buildAllergensListWidget(context, modifier),
                  ],
                ),
              ),
            ),
            // Spacer(),
            Container(
              child: Text(
                getModifierItemsTotalPrice(modifier, widget.unit.currency),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildExtraSets(BuildContext context, List<GeneratedProductConfigSet> extras) {
    List<Widget> widgets = [];
    for (int i = 0; i < extras.length; i++) {
      if (extras[i].type == ConfigType.EXTRA) {
        widgets.add(_buildSingleExtraSet(context, extras[i]));
      }
    }
    return Container(
      // decoration: BoxDecoration(
      //   borderRadius: BorderRadius.circular(
      //     14.0,
      //   ),
      //   border: Border.all(width: 1.5, color: theme.border2),
      //   color: theme.background,
      // ),
      child: Column(
        children: widgets,
      ),
    );
  }

  Widget _buildSingleExtraSet(BuildContext context, GeneratedProductConfigSet extraSet) {
    return Container(
      padding: EdgeInsets.only(
        // top: 8.0,
        // left: 8.0,
        // right: 8.0,
        bottom: 16,
      ),
      child: ExpandablePanel(
        header: Text(
          getLocalizedText(context, extraSet.name),
          style: GoogleFonts.poppins(
            color: theme.text,
            fontSize: 24.0,
          ),
        ),
        collapsed: Text(
          getDetailsTextFromModifierSet(context, extraSet),
          style: GoogleFonts.poppins(
            color: theme.text,
            fontSize: 12.0,
          ),
        ),
        expanded: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            ..._buildSingleExtraList(context, extraSet.items, extraSet.position),
          ],
        ),
      ),
    );
  }

  List<Widget> _buildSingleExtraList(
      BuildContext context, List<GeneratedProductConfigComponent> components, int position) {
    List<Widget> widgets = [];
    components.sort((a, b) => a.position - b.position);
    components.forEach((extra) {
      bool isSelected = _selectedExtras['$position-${extra.position}'] ?? false;

      widgets.add(InkWell(
        onTap: () {
          setState(() {
            _selectedExtras['$position-${extra.position}'] = !isSelected;
          });
          _calculateTotalPrice();
        },
        child: Container(
          child: Row(
            mainAxisAlignment: MainAxisAlignment.start,
            children: [
              Switch(
                activeColor: theme.indicator,
                activeTrackColor: theme.indicator,
                value: isSelected,
                onChanged: (value) {
                  setState(() {
                    _selectedExtras['$position-${extra.position}'] = value;
                  });
                  _calculateTotalPrice();
                },
              ),
              AnimatedDefaultTextStyle(
                duration: const Duration(milliseconds: 500),
                style: _getExtrasFontStyleByIsSelected(isSelected),
                child: Text(
                  getLocalizedText(context, extra.name),
                ),
              ),
              Spacer(),
              AnimatedDefaultTextStyle(
                duration: const Duration(milliseconds: 300),
                style: _getExtrasFontStyleByIsSelected(isSelected),
                child: Text(
                  formatCurrencyWithSignal(extra.price, widget.unit.currency),
                ),
              ),
            ],
          ),
        ),
      ));
    });

    return widgets;
  }

  TextStyle _getExtrasFontStyleByIsSelected(bool isSelected) {
    return isSelected
        ? GoogleFonts.poppins(
            color: theme.highlight,
            fontSize: 18.0,
          )
        : GoogleFonts.poppins(
            color: theme.text.withOpacity(0.5),
            fontSize: 17,
          );
  }

  void _calculateTotalPrice() {
    print('_calculateTotalPrice.modifierPos=$_selectedModifier  ,extras=${_selectedExtras}');
    double price = 0;

    //--- calculate modifier price
    GeneratedProductConfigSet modifier = getModifierConfigSetByPosition(_selectedModifier, widget.product.configSets);
    print('_calculateTotalPrice.modifier=${modifier?.name?.hu}');
    if (modifier != null) {
      modifier.items.forEach((item) => price += item.price);
    }

    _selectedExtras.forEach((key, selected) { 
      if (selected) {
        int configSetPosition = int.parse(key.split('-')[0]);
        int itemPosition = int.parse(key.split('-')[1]);
        GeneratedProductConfigSet extraSet = getExtraConfigSetByPosition(configSetPosition, widget.product.configSets);
        if (extraSet != null) {
          GeneratedProductConfigComponent component = getComponentByPositionFromSet(itemPosition, extraSet);
          if (component != null) {
            price += component.price;
          }
          // print('_calculateTotalPrice.extra[$key]=$configSetPosition, item: $itemPosition, name=${extraSet?.name?.hu}, item=${component?.name?.hu}');
        }
      }
    });

    setState(() {
      _modifierTotalPrice = price;
    });
    // String priceString = formatCurrencyWithSignal(price, widget.unit.currency);
  }
}
