import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/menu/menu.dart';
import 'package:fa_prev/modules/menu/widgets/allergens_widget.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/shared/nav.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:fa_prev/core/theme/theme.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:odometer/odometer.dart';

class ProductConfiguratorWidget extends StatefulWidget {
  final GeoUnit unit;
  final GeneratedProduct product;
  final List<ProductVariant> variants;
  final Cart cart;

  const ProductConfiguratorWidget({Key key, this.unit, this.product, this.variants, this.cart}) : super(key: key);

  @override
  _ProductConfiguratorWidgetState createState() => _ProductConfiguratorWidgetState();
}

class _ProductConfiguratorWidgetState extends State<ProductConfiguratorWidget> {
  Map<String, Map<String, bool>> _selectedExtras = {};
  // Map<String, int> _selectedExtraCount = {};
  Map<String, String> _selectedModifiers = {};
  double _modifierTotalPrice = 0.0;
  Set<String> _allergeens = {};
  ProductVariant productVariant;

  @override
  Widget build(BuildContext context) {
    List<GeneratedProductConfigSet> sets = widget.product.configSets;
    sets.sort((a, b) => a.position - b.position);
    List<ProductVariant> variants = widget.product.variants;
    if (variants == null) {
      return Container();
    }
    List<Widget> variantItems = [];
    variants.forEach((variant) {
      variantItems.add(Container(
        child: ProductDetailVariantItemWidget(
          unit: widget.unit,
          cart: widget.cart,
          product: widget.product,
          variant: variant,
          child: Radio<ProductVariant>(
            value: variant,
            activeColor: theme.indicator,
            groupValue: productVariant,
            onChanged: (ProductVariant selectedVariant) {
              setState(() {
                selectedVariant = productVariant;
              });
            },
          ),
        ),
      ));
    });

    return Column(
      mainAxisAlignment: MainAxisAlignment.start,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // _buildTotalSummary(context),
        _buildAllergensListWidget(context),

        Divider(
          color: theme.background2,
        ),
        Expanded(
          child: SingleChildScrollView(
            physics: BouncingScrollPhysics(),
            child: Container(
              padding: EdgeInsets.all(8.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // _buildAllergensListWidget(context),
                  ProductConfigModifiersWidget(
                    product: widget.product,
                    unit: widget.unit,
                    onModifiersSelected: (modifiers) {
                      this._selectedModifiers = modifiers;
                      _calculateTotalPrice();
                    },
                  ),
                  SizedBox(
                    height: 16.0,
                  ),
                  ProductConfigExtrasWidget(
                    product: widget.product,
                    unit: widget.unit,
                    onExtraSelected: (setId, componentId, selected) {
                      print('onExtraSelected.setId=$setId, componentId=$componentId, selected=$selected');
                      setState(() {
                        if (_selectedExtras[setId] == null) {
                          _selectedExtras[setId] = {};
                        }
                        _selectedExtras[setId][componentId] = selected;
                        print('onExtraSelected._selectedExtras=$_selectedExtras');
                      });
                      _calculateTotalPrice();
                    },
                  )
                  // _buildExtraSets(context, sets),
                ],
              ),
            ),
          ),
        ),
        _buildTotalButtonWidget(context)
      ],
    );
  }

  Widget _buildTotalButtonWidget(BuildContext context) {
    return Container(
      padding: EdgeInsets.all(8.0),
      height: 76.0,
      child: ElevatedButton(
        style: ElevatedButton.styleFrom(
          primary: theme.indicator,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(10),
          ),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              'Total: ', // + formatCurrencyWithSignal(_modifierTotalPrice, widget.unit.currency),
              style: GoogleFonts.poppins(
                fontSize: 24.0,
                color: theme.text2,
              ),
            ),
            AnimatedSlideOdometerNumber(
              letterWidth: 14.0,
              numberTextStyle: GoogleFonts.poppins(
                fontSize: 24.0,
                color: theme.text2,
              ),
              odometerNumber: OdometerNumber(_modifierTotalPrice.toInt()),
              duration: Duration(milliseconds: 300),
            ),
          ],
        ),
        onPressed: () => {},
      ),
    );
  }

  Widget _buildAllergensListWidget(BuildContext context) {
    // for (int i = 0; i < configSet.items.length; i++) {
    //   GeneratedProductConfigComponent component = configSet.items[i];
    //   if (component.allergens != null) {
    //     component.allergens.forEach((allergen) => allergeens.add(allergen.toString().split('.')[1]));
    //   }
    // }

    return Container(
      margin: EdgeInsets.only(left: 8.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.start,
        children: [
          Text(
            'Allergens: ',
            style: GoogleFonts.poppins(
              fontSize: 22.0,
              color: theme.text,
            ),
          ),
          AllergensWidget(
            allergens: _allergeens.toList(),
            showHeader: false,
            size: 40.0,
            fontSize: 10.0,
            iconBorderRadius: 10.0,
          ),
        ],
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
        ],
      ),
    );
  }

  Future<void> _calculateTotalPrice() async {
    // print('_calculateTotalPrice.modifierPos=$_selectedModifiers  ,extras=${_selectedExtras}');
    double price = 0;

    Set<String> allergeens = {};

    //--- calculate modifier price
    _selectedModifiers.forEach((key, value) {
      GeneratedProductConfigSet modifier = getModifierConfigSetById(key, widget.product.configSets);
      // print('_calculateTotalPrice.modifier=${modifier?.name?.hu}');
      if (modifier != null) {
        GeneratedProductConfigComponent component = getComponentByIdFromSet(value, modifier);
        // print('_calculateTotalPrice.component=${component?.name?.hu}: ${component?.price}');
        price += component?.price ?? 0;

        // allergeens.addAll(component.allergens.map((allergen) => allergen.toString().split('.')[1]));
        if (component?.allergens != null) {
          component.allergens.forEach((allergen) => allergeens.add(allergen.toString().split('.')[1]));
        }
      }
    });

    _selectedExtras.forEach((setId, setMap) {
      setMap.forEach((componentId, selected) {
        if (selected == true) {
          GeneratedProductConfigComponent component = getExtraComponentByIdAndSetId(
            setId,
            componentId,
            widget.product.configSets,
          );
          if (component?.allergens != null) {
            component.allergens.forEach((allergen) => allergeens.add(allergen.toString().split('.')[1]));
          }
          // allergeens.addAll(component.allergens.map((allergen) => allergen.toString().split('.')[1]));
          price += component?.price ?? 0;
        }
      });
    });
    print('_calculateTotalPrice.allergeens=$allergeens');
    setState(() {
      _allergeens = allergeens;
      _modifierTotalPrice = price;
    });
  }
}
