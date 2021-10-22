import 'package:fa_prev/core/dependency_indjection/dependency_injection.dart';
import 'package:fa_prev/core/theme/theme.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/cart/cart.dart';
import 'package:fa_prev/modules/login/login.dart';
import 'package:fa_prev/shared/auth/providers/auth_provider_interface.dart';
import 'package:fa_prev/shared/utils/format_utils.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:fa_prev/graphql/generated/crud-api.dart';

class AddVariantWidget extends StatefulWidget {
  final GeoUnit unit;
  final Cart? cart;
  final GeneratedProduct product;
  final ProductVariant variant;
  AddVariantWidget({
    this.cart,
    required this.product,
    required this.variant,
    required this.unit,
  });

  @override
  _AddVariantWidgetState createState() => _AddVariantWidgetState();
}

class _AddVariantWidgetState extends State<AddVariantWidget> {
  Future<void> _addOrder() async {
    User? user = await getIt<IAuthProvider>().getAuthenticatedUserProfile();
    if (user == null) {
      // TODO ezt ki kene vinni vagy a getAuthenticatedUserProfile-ból dobni
      throw LoginException(
        code: LoginException.CODE,
        subCode: LoginException.USER_NOT_LOGGED_IN,
        message: 'User not logged in. getAuthenticatedUserProfile() is null',
      );
    }
    BlocProvider.of<CartBloc>(context).add(AddProductToCartAction(
      widget.unit.id,
      OrderItem(
        productId: widget.product.id,
        variantId: widget.variant.id!,
        image: widget.product.image,
        priceShown: PriceShown(
          currency: widget.unit.currency,
          pricePerUnit: widget.variant.price,
          priceSum: widget.variant.price,
          tax: 0,
          taxSum: 0,
        ),
        sumPriceShown: PriceShown(
          currency: widget.unit.currency,
          pricePerUnit: widget.variant.price,
          priceSum: widget.variant.price,
          tax: 0,
          taxSum: 0,
        ),
        allergens: widget.product.allergens,
        productType: widget.product.productType,
        productName: widget.product.name,
        variantName: widget.variant.variantName,
        statusLog: [
          StatusLog(
            userId: user.id,
            status: OrderStatus.none,
            ts: 0,
          ),
        ],
        quantity: 0,
      ),
    ));
  }

  @override
  Widget build(BuildContext context) {
    final int variantCountInCart =
        widget.cart?.variantCount(widget.product, widget.variant) ?? 0;
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
                formatCurrency(widget.variant.price, widget.unit.currency),
                textAlign: TextAlign.right,
                style: Fonts.satoshi(
                  color: theme.primary,
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
                  backgroundColor: theme.primary,
                  primary: theme.secondary0,
                ),
                onPressed: () {
                  _addOrder();
                },
                child: AnimatedSwitcher(
                  duration: const Duration(milliseconds: 300),
                  transitionBuilder:
                      (Widget child, Animation<double> animation) {
                    return ScaleTransition(
                      child: child,
                      scale: animation,
                    );
                  },
                  child: Text(
                    variantCountInCart == 0 ? '+' : 'x$variantCountInCart',
                    key: ValueKey<String>(
                        '${widget.variant.id}-$variantCountInCart'),
                    softWrap: false,
                    textAlign: TextAlign.center,
                    style: Fonts.satoshi(
                      color: theme.secondary0,
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
