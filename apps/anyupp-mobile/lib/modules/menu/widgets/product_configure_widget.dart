import 'package:fa_prev/core/dependency_indjection/dependency_injection.dart';
import 'package:fa_prev/core/theme/theme.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/menu/bloc/configset_bloc.dart';
import 'package:fa_prev/modules/menu/bloc/configset_event.dart';
import 'package:fa_prev/modules/menu/menu.dart';
import 'package:fa_prev/modules/menu/widgets/allergens_widget.dart';
import 'package:fa_prev/shared/auth/providers/auth_provider_interface.dart';
import 'package:fa_prev/shared/utils/format_utils.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:google_fonts/google_fonts.dart';

class ProductConfiguratorWidget extends StatefulWidget {
  final GeoUnit unit;
  final GeneratedProduct product;

  const ProductConfiguratorWidget({required this.unit, required this.product});

  @override
  _ProductConfiguratorWidgetState createState() => _ProductConfiguratorWidgetState();
}

class _ProductConfiguratorWidgetState extends State<ProductConfiguratorWidget> {
  Map<String, Map<String, bool>> _selectedExtras = {};
  Map<String, String> _selectedModifiers = {};
  double _modifierTotalPrice = 0.0;
  Set<String> _allergeens = {};
  late ProductVariant? _productVariant;

  @override
  void initState() {
    _productVariant = widget.product.variants.first;
    widget.product.configSets?.forEach((element) {
      _selectedModifiers[element.productSetId] = element.items.first.productComponentId;
    });
    _calculateTotalPrice();
    super.initState();
  }

  Future<void> setButton() async {
    OrderItem? orderItem = await getOrderItem();
    if (orderItem != null) {
      BlocProvider.of<ConfigsetBloc>(context)
          .add(ConfigsetUpdatedEvent(orderItem: orderItem, unit: widget.unit, totalPrice: _modifierTotalPrice));
    }
  }

  Future<OrderItem?> getOrderItem() async {
    User? user = await getIt<IAuthProvider>().getAuthenticatedUserProfile();
    if (_productVariant != null) {
      return OrderItem(
        productId: widget.product.id,
        variantId: _productVariant!.id!,
        image: widget.product.image,
        priceShown: PriceShown(
          currency: widget.unit.currency,
          pricePerUnit: _productVariant!.price,
          priceSum: _productVariant!.price,
          tax: 0,
          taxSum: 0,
        ),
        sumPriceShown: PriceShown(
          currency: widget.unit.currency,
          pricePerUnit: _productVariant!.price,
          priceSum: _productVariant!.price,
          tax: 0,
          taxSum: 0,
        ),
        allergens: widget.product.allergens,
        productName: widget.product.name,
        variantName: _productVariant!.variantName,
        // generatedProductConfigSet: widget.product.,
        statusLog: [
          StatusLog(
            userId: user!.id,
            status: 'CART',
            ts: 0,
          ),
        ],
        quantity: 0,
        selectedConfigMap: getSelectedComponentMap(),
      );
    }

    return null;
  }

  @override
  Widget build(BuildContext context) {
    List<GeneratedProductConfigSet>? sets = widget.product.configSets;
    if (sets != null) {
      sets.sort((a, b) => a.position! - b.position!);
    }
    List<ProductVariant> variants = widget.product.variants;
    if (variants.isEmpty) {
      return Container();
    }
    List<Widget> variantItems = [];
    variants.forEach((variant) {
      variantItems.add(ProductDetailVariantItemWidget(
        unit: widget.unit,
        product: widget.product,
        variant: variant,
        child: Row(
          children: [
            Container(
              margin: EdgeInsets.only(right: 8.0),
              child: Text(
                formatCurrency(variant.price, widget.unit.currency),
                textAlign: TextAlign.right,
                style: GoogleFonts.poppins(
                  color: theme.highlight,
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
            Radio<ProductVariant>(
              value: variant,
              activeColor: theme.indicator,
              groupValue: _productVariant,
              onChanged: (ProductVariant? selectedVariant) {
                setState(() {
                  _productVariant = selectedVariant;
                  _calculateTotalPrice();
                });
              },
            ),
          ],
        ),
      ));
    });

    return SingleChildScrollView(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // _buildTotalSummary(context),
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
                  onModifiersSelected: (modifiers) async {
                    this._selectedModifiers = modifiers;
                    await setButton();
                    _calculateTotalPrice();
                    setState(() {});
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
                      _selectedExtras[setId]![componentId] = selected;
                      print('onExtraSelected._selectedExtras=$_selectedExtras');
                      _calculateTotalPrice();
                    });
                  },
                )
                // _buildExtraSets(context, sets),
              ],
            ),
          ),
          _buildAllergensListWidget(context),
          // _buildTotalButtonWidget(context)
        ],
      ),
    );
  }

  Widget _buildAllergensListWidget(BuildContext context) {
    return AllergensWidget(
      allergens: _allergeens.toList(),
    );
  }

  Map<GeneratedProductConfigSet, List<GeneratedProductConfigComponent>> getSelectedComponentMap() {
    Map<GeneratedProductConfigSet, List<GeneratedProductConfigComponent>> selectedConfigMap = {};
    _selectedModifiers.forEach((key, value) {
      GeneratedProductConfigSet? modifier = getModifierConfigSetById(key, widget.product.configSets ?? []);
      if (modifier != null) {
        GeneratedProductConfigComponent? component = getComponentByIdFromSet(value, modifier);
        selectedConfigMap[modifier] = component == null ? [] : [component];
      }
    });
    _selectedExtras.forEach((key, value) {
      GeneratedProductConfigSet? modifier = getExtraConfigSetById(key, widget.product.configSets ?? []);
      value.forEach((extra, isAdded) {
        if (isAdded) {
          GeneratedProductConfigComponent? component = getComponentByIdFromSet(extra, modifier);
          if (selectedConfigMap[modifier] == null && modifier != null && component != null) {
            selectedConfigMap[modifier] = [component];
          } else {
            if (modifier != null) {
              var map = selectedConfigMap[modifier];
              if (map == null) {
                map = [];
                selectedConfigMap[modifier] = map;
              }
              if (component != null) {
                map.add(component);
              }
            }
          }
        }
      });
    });
    return selectedConfigMap;
  }

  void _calculateTotalPrice() {
    // print('_calculateTotalPrice.modifierPos=$_selectedModifiers  ,extras=${_selectedExtras}');
    double price = _productVariant?.price ?? 0;

    Set<String> allergeens = {};
    if (widget.product.allergens != null && widget.product.allergens!.isNotEmpty) {
      allergeens.addAll(widget.product.allergens!);
    }
    //--- calculate modifier price
    _selectedModifiers.forEach((key, value) {
      GeneratedProductConfigSet? modifier = getModifierConfigSetById(key, widget.product.configSets ?? []);
      // print('_calculateTotalPrice.modifier=${modifier?.name?.hu}');
      GeneratedProductConfigComponent? component = getComponentByIdFromSet(value, modifier);
      // print('_calculateTotalPrice.component=${component?.name?.hu}: ${component?.price}');
      price += component?.price ?? 0;

      if (component != null) {
        component.allergens?.forEach((allergen) => allergeens.add(allergen.toString().split('.')[1]));
      }
    });

    _selectedExtras.forEach((setId, setMap) {
      setMap.forEach((componentId, selected) {
        if (selected == true) {
          GeneratedProductConfigComponent? component = getExtraComponentByIdAndSetId(
            setId,
            componentId,
            widget.product.configSets ?? [],
          );
          if (component != null) {
            component.allergens?.forEach((allergen) => allergeens.add(allergen.toString().split('.')[1]));
            // allergeens.addAll(component.allergens.map((allergen) => allergen.toString().split('.')[1]));
            price += component.price;
          }
        }
      });
    });
    print('_calculateTotalPrice.allergeens=$allergeens');

    _allergeens = allergeens;
    _modifierTotalPrice = price;
    setButton();
  }
}
