import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/menu/menu.dart';
import 'package:flutter/material.dart';

class ProductDetailVariantListWidget extends StatefulWidget {
  final GeoUnit unit;
  final GeneratedProduct product;
  final Cart? cart;

  const ProductDetailVariantListWidget({
    required this.unit,
    required this.product,
    required this.cart,
  });

  @override
  _ProductDetailVariantListWidgetState createState() => _ProductDetailVariantListWidgetState();
}

class _ProductDetailVariantListWidgetState extends State<ProductDetailVariantListWidget> {
  List<bool> expanded = [];

  @override
  Widget build(BuildContext context) {
    if (widget.product.configSets == null ||
        (widget.product.configSets != null && widget.product.configSets!.isEmpty)) {
      return _buildWithNormalPanel(context);
    } else {
      return Padding(
        padding: const EdgeInsets.all(16),
        child: ProductConfiguratorWidget(
          product: widget.product,
          unit: widget.unit,
        ),
      );
    }

    //return _buildWithExpansionPanel(context);
  }

  Widget _buildWithNormalPanel(BuildContext context) {
    List<ProductVariant> variants = widget.product.variants;
    if (variants.isEmpty) {
      return Container();
    }

    List<Widget> items = [];
    variants.forEach((variant) {
      items.add(Padding(
        padding: EdgeInsets.symmetric(horizontal: 16),
        child: ProductDetailVariantItemWidget(
          unit: widget.unit,
          product: widget.product,
          variant: variant,
          child: AddVariantWidget(
            unit: widget.unit,
            cart: widget.cart,
            product: widget.product,
            variant: variant,
          ),
        ),
      ));
    });
    if (widget.product.allergens != null &&
        (widget.product.allergens != null && widget.product.allergens!.isNotEmpty)) {
      items.add(Padding(
        padding: const EdgeInsets.all(16),
        child: AllergensWidget(allergens: widget.product.allergens!),
      ));
    }
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: items,
    );
  }

  Widget buildWithExpansionPanel(BuildContext context) {
    List<ExpansionPanel> variants = [];
    for (int i = 0; i < widget.product.variants.length; i++) {
      variants.add(_createVariantPanel(context, i));
      expanded.add(false);
    }

    return ExpansionPanelList(
      elevation: 0,
      animationDuration: Duration(seconds: 1),
      expansionCallback: (int index, bool isExpanded) {
        setState(() {
          expanded[index] = !expanded[index];
        });
      },
      children: variants,
    );
  }

  ExpansionPanel _createVariantPanel(BuildContext context, int pos) {
    ProductVariant variant = widget.product.variants[pos];
    return ExpansionPanel(
      canTapOnHeader: true,
      isExpanded: expanded[pos],
      headerBuilder: (context, isExpanded) {
        return ProductDetailVariantItemWidget(
          unit: widget.unit,
          product: widget.product,
          variant: variant,
        );
      },
      body: _buildVariantExpandedBody(context),
    );
  }

  Widget _buildVariantExpandedBody(BuildContext context) {
    return Container(
      color: Colors.black38,
      height: 200,
      child: Center(
        child: Text('TEXT'),
      ),
    );
  }

  // Future<void> _addOrder(BuildContext context, ProductVariant variant) async {
  //   User user = await getIt<IAuthProvider>().getAuthenticatedUserProfile();
  //   BlocProvider.of<CartBloc>(context).add(AddProductToCartAction(
  //     widget.unit,
  //     OrderItem(
  //       productId: widget.product.id,
  //       variantId: variant.id,
  //       image: widget.product.image,
  //       priceShown: PriceShown(
  //         currency: widget.unit.currency ?? 'huf', // TODO
  //         pricePerUnit: variant.price,
  //         priceSum: variant.price,
  //         tax: 0,
  //         taxSum: 0,
  //       ),
  //       allergens: widget.product.allergens,
  //       productName: widget.product.name,
  //       takeAway: false,
  //       variantName: variant.variantName,
  //       statusLog: [
  //         StatusLog(
  //           userId: user.id,
  //           status: 'CART',
  //           ts: 0,
  //         ),
  //       ],
  //       quantity: 0,
  //     ),
  //   ));
  // }
}
