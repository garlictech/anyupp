import 'package:fa_prev/core/dependency_indjection/dependency_injection.dart';
import 'package:fa_prev/core/theme/theme.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/menu/bloc/configset_bloc.dart';
import 'package:fa_prev/modules/menu/bloc/configset_event.dart';
import 'package:fa_prev/modules/menu/menu.dart';
import 'package:fa_prev/modules/menu/widgets/allergens_widget.dart';
import 'package:fa_prev/shared/auth/providers/auth_provider_interface.dart';
import 'package:fa_prev/shared/locale/locale.dart';
import 'package:fa_prev/shared/utils/format_utils.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:fa_prev/graphql/generated/crud-api.dart';

class ProductConfiguratorWidget extends StatefulWidget {
  final GeoUnit unit;
  final GeneratedProduct product;
  final ServingMode? servingMode;

  const ProductConfiguratorWidget({
    required this.unit,
    required this.product,
    required this.servingMode,
  });

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
    print('******* ProductConfiguratorWidget.initState().widget=${widget.product}');
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
        productType: 'productType',
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
            status: OrderStatus.none,
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
    List<ProductVariant> variants = widget.product.variants;
    if (variants.isEmpty) {
      return Container();
    }
    bool buildVariants = widget.product.variants.length > 1;

    return Column(
      mainAxisAlignment: MainAxisAlignment.start,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // _buildTotalSummary(context),
        Divider(
          color: theme.secondary12,
          height: 1,
        ),
        if (buildVariants) _buildVariants(variants),
        Container(
          // padding: EdgeInsets.all(8.0),
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
              // SizedBox(
              //   height: 16.0,
              // ),
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
    );
  }

  Widget _buildAllergensListWidget(BuildContext context) {
    if (_allergeens.isEmpty) {
      return Container();
    }
    return Container(
      margin: EdgeInsets.only(top: 16.0),
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
        child: AllergensWidget(
          allergens: _allergeens.toList(),
        ),
      ),
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

  Widget _buildVariants(List<ProductVariant> variants) {
    List<Widget> variantItems = [];
    // var size = 1;
    for (int i = 0; i < variants.length; i += 2) {
      // print('_buildVariants=$i');
      variantItems.add(
        _buildVariantsGrid(
          variants[i],
          (i + 1 < variants.length) ? variants[i + 1] : null,
        ),
      );
    }

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
      child: Column(
        // mainAxisSize: MainAxisSize.max,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.only(
              top: 12,
              bottom: 12,
              left: 16,
            ),
            child: Text(
              'Válassz méretet',
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
          SizedBox(
            height: 16.0,
          ),
          ...variantItems,
        ],
      ),
    );
  }

  Widget _buildVariantsGrid(ProductVariant variant1, ProductVariant? variant2) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
      mainAxisSize: MainAxisSize.max,
      children: [
        Flexible(
          flex: 1,
          child: Container(
            padding: EdgeInsets.only(
              right: 16,
              bottom: 16,
            ),
            child: _buildVariantItem(variant1),
          ),
        ),
        // if (i + 1 < size)
        Flexible(
          flex: 1,
          child: Container(
            padding: EdgeInsets.only(
              bottom: 16,
            ),
            child: variant2 != null
                ? _buildVariantItem(variant2)
                : Container(
                    // DUMMY!!!!
                    // color: Colors.,
                    width: 80,
                    height: 80,
                  ),
          ),
        ),
      ],
    );
  }

  Widget _buildVariantItem(ProductVariant variant) {
    bool selected = variant.id == _productVariant?.id;
    return Column(
      children: [
        InkWell(
          onTap: () {
            setState(() {
              _productVariant = variant;
              _calculateTotalPrice();
            });
          },
          child: AnimatedSwitcher(
            duration: const Duration(milliseconds: 250),
            transitionBuilder: (Widget child, Animation<double> animation) {
              return FadeTransition(
                child: child,
                opacity: animation,
              );
            },
            child: Container(
              key: ValueKey<bool>(selected),
              width: 110.0,
              height: 110.0,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: selected ? theme.primary.withOpacity(0.24) : theme.secondary12,
                border: Border.all(
                  color: selected ? theme.primary : theme.secondary16,
                  width: 4.0,
                ),
              ),
              child: Center(
                child: Text(
                  variant.pack != null ? '${_formatPack(variant.pack!.size)} ${variant.pack!.unit}' : '',
                  textAlign: TextAlign.center,
                  style: Fonts.satoshi(
                    fontSize: 18.0,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
            ),
          ),
        ),
        SizedBox(
          height: 4.0,
        ),
        Text(
          getLocalizedText(context, variant.variantName),
          style: Fonts.satoshi(
            fontSize: 16,
            fontWeight: FontWeight.w400,
            color: theme.secondary,
          ),
        ),
        SizedBox(
          height: 2.0,
        ),
        Text(
          formatCurrency(variant.price, widget.unit.currency),
          style: Fonts.satoshi(
            fontSize: 16,
            fontWeight: FontWeight.w400,
            color: theme.primary,
          ),
        )
      ],
    );
  }

  String _formatPack(double pack) {
    String s = pack.toStringAsFixed(1);
    if (s.endsWith('.0')) {
      return s.substring(0, s.length - 2);
    }
    return s;
  }
}
