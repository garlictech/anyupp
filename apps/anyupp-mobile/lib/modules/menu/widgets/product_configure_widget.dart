import 'package:fa_prev/core/dependency_indjection/dependency_injection.dart';
import 'package:fa_prev/core/theme/theme.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/cart/bloc/cart_bloc.dart';
import 'package:fa_prev/modules/cart/bloc/cart_event.dart';
import 'package:fa_prev/modules/menu/menu.dart';
import 'package:fa_prev/modules/menu/widgets/allergens_widget.dart';
import 'package:fa_prev/shared/auth/providers/auth_provider_interface.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:odometer/odometer.dart';
import 'package:fa_prev/shared/locale.dart';

class ProductConfiguratorWidget extends StatefulWidget {
  final GeoUnit unit;
  final GeneratedProduct product;
  final Cart cart;

  const ProductConfiguratorWidget({Key key, this.unit, this.product, this.cart}) : super(key: key);

  @override
  _ProductConfiguratorWidgetState createState() => _ProductConfiguratorWidgetState();
}

class _ProductConfiguratorWidgetState extends State<ProductConfiguratorWidget> {
  Map<String, Map<String, bool>> _selectedExtras = {};
  // Map<String, int> _selectedExtraCount = {};
  Map<String, String> _selectedModifiers = {};
  double _modifierTotalPrice = 0.0;
  Set<String> _allergeens = {};
  ProductVariant _productVariant;

  @override
  void initState() {
    _productVariant = widget.product.variants.first;
    _allergeens.addAll(widget.product.allergens);
    _calculateTotalPrice();
    widget.product.configSets.forEach((element) {
      _selectedModifiers[element.productSetId] = element.items.first.productComponentId;
    });
    super.initState();
  }

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
      variantItems.add(ProductDetailVariantItemWidget(
        unit: widget.unit,
        cart: widget.cart,
        product: widget.product,
        variant: variant,
        child: Radio<ProductVariant>(
          value: variant,
          activeColor: theme.indicator,
          groupValue: _productVariant,
          onChanged: (ProductVariant selectedVariant) {
            setState(() {
              selectedVariant = _productVariant;
            });
          },
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
        ...variantItems,
        Container(
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
              trans("cart.addToCart"), // + formatCurrencyWithSignal(_modifierTotalPrice, widget.unit.currency),
              style: GoogleFonts.poppins(
                fontSize: 24.0,
                color: theme.text2,
              ),
            ),
            Text(
              " (", // + formatCurrencyWithSignal(_modifierTotalPrice, widget.unit.currency),
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
            Text(
              ")", // + formatCurrencyWithSignal(_modifierTotalPrice, widget.unit.currency),
              style: GoogleFonts.poppins(
                fontSize: 24.0,
                color: theme.text2,
              ),
            ),
          ],
        ),
        onPressed: () async {
          User user = await getIt<IAuthProvider>().getAuthenticatedUserProfile();
          BlocProvider.of<CartBloc>(context).add(AddProductToCartAction(
              widget.unit,
              OrderItem(
                productId: widget.product.id,
                variantId: _productVariant.id,
                image: widget.product.image,
                priceShown: PriceShown(
                  currency: widget.unit.currency ?? 'huf', // TODO
                  pricePerUnit: _productVariant.price,
                  priceSum: _productVariant.price,
                  tax: 0,
                  taxSum: 0,
                ),
                allergens: widget.product.allergens,
                productName: widget.product.name,
                takeAway: false,
                variantName: _productVariant.variantName,
                // generatedProductConfigSet: widget.product.,
                statusLog: [
                  StatusLog(
                    userId: user.id,
                    status: 'CART',
                    ts: 0,
                  ),
                ],
                quantity: 0,
                selectedConfigMap: getSelectedComponentMap(),
              )));
        },
      ),
    );
  }

  Widget _buildAllergensListWidget(BuildContext context) {
    return AllergensWidget(allergens: _allergeens.toList());
  }

  // Widget _buildTotalSummary(BuildContext context) {
  //   return Container(
  //     child: Column(
  //       children: [
  //         Row(
  //           mainAxisAlignment: MainAxisAlignment.spaceBetween,
  //           children: [
  //             Text(
  //               'Total',
  //               style: GoogleFonts.poppins(
  //                 fontSize: 30.0,
  //                 color: theme.text,
  //               ),
  //             ),
  //             Text(
  //               formatCurrencyWithSignal(_modifierTotalPrice, widget.unit.currency),
  //               style: GoogleFonts.poppins(
  //                 fontSize: 30.0,
  //                 color: theme.text,
  //               ),
  //             ),
  //           ],
  //         ),
  //         Divider(
  //           color: theme.border2,
  //         ),
  //       ],
  //     ),
  //   );
  // }

  Map<GeneratedProductConfigSet, List<GeneratedProductConfigComponent>> getSelectedComponentMap() {
    Map<GeneratedProductConfigSet, List<GeneratedProductConfigComponent>> selectedConfigMap = {};
    _selectedModifiers.forEach((key, value) {
      GeneratedProductConfigSet modifier = getModifierConfigSetById(key, widget.product.configSets);
      if (modifier != null) {
        GeneratedProductConfigComponent component = getComponentByIdFromSet(value, modifier);
        selectedConfigMap[modifier] = [component];
      }
    });
    _selectedExtras.forEach((key, value) {
      GeneratedProductConfigSet modifier = getExtraConfigSetById(key, widget.product.configSets);
      if (modifier != null) {
        value.forEach((extra, isAdded) {
          if (isAdded) {
            GeneratedProductConfigComponent component = getComponentByIdFromSet(extra, modifier);
            if (selectedConfigMap[modifier] == null) {
              selectedConfigMap[modifier] = [component];
            } else {
              selectedConfigMap[modifier].add(component);
            }
          }
        });
      }
    });
    return selectedConfigMap;
  }

  Future<void> _calculateTotalPrice() async {
    // print('_calculateTotalPrice.modifierPos=$_selectedModifiers  ,extras=${_selectedExtras}');
    double price = _productVariant.price;

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
