import 'package:fa_prev/core/dependency_indjection/dependency_injection.dart';
import 'package:fa_prev/core/theme/theme.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/cart/cart.dart';
import 'package:fa_prev/shared/auth/providers/auth_provider_interface.dart';
import 'package:fa_prev/shared/utils/format_utils.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:google_fonts/google_fonts.dart';

class AddVariantWidget extends StatefulWidget {
  final GeoUnit unit;
  final Cart cart;
  final GeneratedProduct product;
  final ProductVariant variant;
  AddVariantWidget({this.cart, this.product, this.variant, this.unit, Key key}) : super(key: key);

  @override
  _AddVariantWidgetState createState() => _AddVariantWidgetState();
}

class _AddVariantWidgetState extends State<AddVariantWidget> {
  
  Future<void> _addOrder() async {
    User user = await getIt<IAuthProvider>().getAuthenticatedUserProfile();
    BlocProvider.of<CartBloc>(context).add(AddProductToCartAction(
      widget.unit,
      OrderItem(
        productId: widget.product.id,
        variantId: widget.variant.id,
        image: widget.product.image,
        priceShown: PriceShown(
          currency: widget.unit.currency ?? 'ft', // TODO
          pricePerUnit: widget.variant.price,
          priceSum: widget.variant.price,
          tax: 0,
          taxSum: 0,
        ),
        allergens: widget.product.allergens,
        productName: widget.product.name,
        takeAway: false,
        variantName: widget.variant.variantName,
        statusLog: [
          StatusLog(
            userId: user.id,
            status: 'CART',
            ts: 0,
          ),
        ],
        quantity: 0,
      ),
    ));
  }

  @override
  Widget build(BuildContext context) {
    final int variantCountInCart = widget.cart == null ? 0 : widget.cart.variantCount(widget.product, widget.variant);
    return Container(
      child: Align(
        alignment: Alignment.centerRight,
        // flex: 35,
        child: Row(
          mainAxisAlignment: MainAxisAlignment.start,
          children: [
            Container(
              margin: EdgeInsets.only(right: 8.0),
              child: Text(
                formatCurrency(widget.variant.price, widget.unit.currency ?? 'ft'), 
                textAlign: TextAlign.right,
                style: GoogleFonts.poppins(
                  color: theme.highlight,
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
            Container(
              width: 46,
              height: 46,
              margin: EdgeInsets.only(right: 15),
              child: TextButton(
                style: TextButton.styleFrom(
                  padding: EdgeInsets.all(0),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10.0),
                  ),
                  backgroundColor: theme.indicator,
                  primary: theme.text2,
                ),
                onPressed: () {
                  _addOrder(); // TODO
                  // Nav.to(
                  //   ProductConfiguratorScreen(
                  //     cart: widget.cart,
                  //     product: widget.product,
                  //     variant: widget.variant,
                  //     unit: widget.unit,
                  //   ),
                  //duration: Duration(milliseconds: 100),
                  //animationType: NavAnim.SLIDEIN_DOWN,
                  // );
                },
                child: AnimatedSwitcher(
                  duration: const Duration(milliseconds: 300),
                  transitionBuilder: (Widget child, Animation<double> animation) {
                    return ScaleTransition(
                      child: child,
                      scale: animation,
                    );
                  },
                  child: Text(
                    variantCountInCart == 0 ? '+' : 'x$variantCountInCart',
                    key: ValueKey<String>('${widget.variant.id}-$variantCountInCart'),
                    softWrap: false,
                    textAlign: TextAlign.center,
                    style: GoogleFonts.poppins(
                      color: theme.text2,
                      fontSize: variantCountInCart == 0 ? 32.0 : 24.0,
                      fontWeight: FontWeight.w400,
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
