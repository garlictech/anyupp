import 'package:fa_prev/core/dependency_indjection/dependency_injection.dart';
import 'package:fa_prev/core/theme/theme.dart';
import 'package:fa_prev/core/units/units.dart';
import 'package:fa_prev/graphql/generated/crud-api.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/cart/cart.dart';
import 'package:fa_prev/modules/main/main.dart';
import 'package:fa_prev/modules/payment/payment.dart';
import 'package:fa_prev/modules/selectunit/screens/flutter_qr_code_scanner.dart';
import 'package:fa_prev/modules/takeaway/takeaway.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/shared/utils/format_utils.dart';
import 'package:fa_prev/shared/utils/navigator.dart';
import 'package:fa_prev/shared/utils/stage_utils.dart';
import 'package:fa_prev/shared/widgets.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_staggered_animations/flutter_staggered_animations.dart';
import 'package:flutter_svg/flutter_svg.dart';

class CartScreen extends StatelessWidget {
  final ScrollController _controller = ScrollController();

  @override
  Widget build(BuildContext context) {
    return BlocListener<StripePaymentBloc, StripePaymentState>(
      listener: (context, state) {
        if (state is StripeOperationSuccess || state is StripeError) {
          // Go to Orders when payment finished
          Future.delayed(Duration(milliseconds: 500)).then((value) {
            getIt<MainNavigationBloc>().add(DoMainNavigation(pageIndex: 2));
            Nav.pop();
          });
        }
      },
      child: Scaffold(
        appBar: AppBar(
          backgroundColor: theme.secondary0,
          centerTitle: true,
          elevation: 3.0,
          shadowColor: theme.secondary.withOpacity(0.1),
          leading: Padding(
            padding: const EdgeInsets.only(
              top: 8.0,
              bottom: 8.0,
              left: 15.0,
            ),
            child: BackButtonWidget(
              color: theme.secondary,
              showBorder: false,
            ),
          ),
          actions: [
            BlocBuilder<TakeAwayBloc, TakeAwayState>(builder: (context, state) {
              if (state is ServingModeSelectedState) {
                Cart? cart = getIt.get<CartRepository>().cart;

                return Container(
                  margin: EdgeInsets.only(top: 12.0, bottom: 12.0, right: 16.0),
                  child: InkWell(
                    onTap: () async {
                      await showSelectServingModeSheetWithDeleteConfirm(
                        context,
                        cart,
                        state.servingMode,
                        initialPosition: state.servingMode == ServingMode.inPlace ? 0 : 1,
                        pop: true,
                      );
                      // Nav.pop();
                    },
                    child: TakeawayStatusWidget(
                      servingMode: state.servingMode,
                    ),
                  ),
                );
              }
              return Container();
            }),
          ],
          // Only dev and qa builds are show the table and seat in the top right corner
          title: BlocBuilder<UnitSelectBloc, UnitSelectState>(
            builder: (context, state) {
              if (state is UnitSelected) {
                return StreamBuilder<Cart?>(
                  stream: getIt<CartRepository>().getCurrentCartStream(state.unit.id),
                  builder: (context, AsyncSnapshot<Cart?> snapshot) {
                    // print('placeSnapshot=');

                    if (snapshot.hasData) {
                      bool show = snapshot.data?.place?.seat != null &&
                          snapshot.data?.place?.seat != EMPTY_SEAT &&
                          snapshot.data?.place?.table != null &&
                          snapshot.data?.place?.table != EMPTY_TABLE &&
                          isDev;

                      if (!show) {
                        return Text(
                          trans(context, 'main.menu.cart'),
                          style: Fonts.satoshi(
                            color: theme.secondary,
                            fontSize: 16.0,
                            fontWeight: FontWeight.w600,
                          ),
                        );
                      }

                      return Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            trans(context, 'main.menu.cart'),
                            style: Fonts.satoshi(
                              color: theme.secondary,
                              fontSize: 16.0,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.start,
                            children: [
                              SvgPicture.asset(
                                'assets/icons/table-icon.svg',
                                width: 20,
                                height: 20,
                                color: theme.primary,
                              ),
                              Text(
                                ' ${snapshot.data?.place?.table ?? "-"}',
                                style: Fonts.satoshi(
                                  color: theme.secondary,
                                  fontSize: 14.0,
                                  fontWeight: FontWeight.w400,
                                ),
                              ),
                              SvgPicture.asset(
                                'assets/icons/chair-icon.svg',
                                width: 20,
                                height: 20,
                                color: theme.primary,
                              ),
                              Text(
                                '${snapshot.data?.place?.seat ?? "-"}',
                                style: Fonts.satoshi(
                                  color: theme.secondary,
                                  fontSize: 14.0,
                                  fontWeight: FontWeight.w400,
                                ),
                              )
                            ],
                          ),
                        ],
                      );
                    }

                    return Container();
                  },
                );
              }
              return Container();
            },
          ),
        ),
        body: Container(
          color: theme.secondary0,
          child: BlocBuilder<UnitSelectBloc, UnitSelectState>(
            builder: (context, state) {
              if (state is UnitSelected) {
                return StreamBuilder<Cart?>(
                  stream: getIt<CartRepository>().getCurrentCartStream(state.unit.id),
                  builder: (context, AsyncSnapshot<Cart?> snapshot) {
                    if (snapshot.connectionState != ConnectionState.waiting || snapshot.hasData) {
                      if (snapshot.data != null && snapshot.data?.items.isNotEmpty == true) {
                        return _buildCartListAndTotal(context, state.unit, snapshot.data!);
                      }
                      return _emptyCart(context);
                    }

                    return CenterLoadingWidget();
                  },
                );
              }
              return CenterLoadingWidget();
            },
          ),
        ),
      ),
    );
  }

  Widget _buildCartListAndTotal(BuildContext context, GeoUnit unit, Cart cart) {
    Map<int, String> cartAllergens = {};
    for (OrderItem item in cart.items) {
      if (item.allergens != null) {
        for (String allergen in item.allergens!) {
          cartAllergens[allergenMap[allergen]!] = allergen;
        }
      }
      if (item.selectedConfigMap != null) {
        item.selectedConfigMap!.forEach((key, value) {
          for (GeneratedProductConfigComponent component in value) {
            if (component.allergens != null) {
              for (Allergen allergen in component.allergens!) {
                String temp = allergen.toString().split(".").last;
                cartAllergens[allergenMap[temp]!] = temp;
              }
            }
          }
        });
      }
    }
    return Column(
      children: <Widget>[
        // LIST
        Expanded(
          flex: 10,
          child: Container(
            //margin: EdgeInsets.symmetric(horizontal: 15),
            // padding: EdgeInsets.only(left: 15, right: 2), // EdgeInsets.symmetric(horizontal: 15),
            child: AnimationLimiter(
              child: RawScrollbar(
                controller: _controller,
                thumbColor: theme.secondary.withOpacity(0.2),
                radius: Radius.circular(20),
                isAlwaysShown: true,
                thickness: 4,
                child: ListView.separated(
                  separatorBuilder: (context, index) => Divider(
                    color: theme.secondary64.withOpacity(0.3),
                  ),
                  controller: _controller,
                  shrinkWrap: true,
                  physics: BouncingScrollPhysics(),
                  itemCount: cart.items.length,
                  itemBuilder: (context, position) {
                    final OrderItem order = cart.items[position];
                    return AnimationConfiguration.staggeredList(
                      position: position,
                      duration: const Duration(milliseconds: 200),
                      child: _buildCartItem(context, unit, order),
                    );
                  },
                ),
              ),
            ),
          ),
        ),
        _buildPaymentButtonPanel(context, unit, cart),
        // TOTAL
        //_buildTotal(context, unit, cart)
      ],
    );
  }

  Widget _buildPaymentButtonPanel(BuildContext context, GeoUnit unit, Cart cart) {
    bool showQrCodeScan = false;
    if (cart.place == null || (cart.place?.seat == EMPTY_SEAT && cart.place?.table == EMPTY_TABLE)) {
      showQrCodeScan = true;
    }
    return Column(
      mainAxisAlignment: MainAxisAlignment.start,
      children: [
        Container(
          height: 56.0,
          width: double.infinity,
          margin: EdgeInsets.symmetric(
            horizontal: 16.0,
          ),
          child: ElevatedButton(
            onPressed: () => showQrCodeScan
                ? Nav.to(QRCodeScannerScreen(
                    navigateToCart: true,
                    loadUnits: true,
                  ))
                : showSelectPaymentMethodBottomSheet(context),
            style: ElevatedButton.styleFrom(
              primary: theme.primary,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(40),
              ),
            ),
            child: Stack(
              fit: StackFit.expand,
              children: [
                Positioned.fill(
                  child: Align(
                    alignment: Alignment.center,
                    child: Text(
                      //trans(context, "cart.addToCart").toUpperCase(),
                      '${trans(context, "cart.pay")} (${formatCurrency(cart.totalPrice, unit.currency)})',
                      style: Fonts.satoshi(
                        fontSize: 16.0,
                        fontWeight: FontWeight.w700,
                        color: theme.secondary0,
                      ),
                    ),
                  ),
                ),
                Positioned.fill(
                  child: Align(
                    alignment: Alignment.centerRight,
                    child: showQrCodeScan
                        ? SvgPicture.asset(
                            'assets/icons/qr_code_scanner.svg',
                            color: theme.secondary0,
                          )
                        : Icon(
                            Icons.arrow_forward,
                            color: theme.secondary0,
                          ),
                  ),
                )
              ],
            ),
          ),
        ),
        // DELETE CART BUTTON
        Container(
          width: double.infinity,
          padding: EdgeInsets.only(
            left: 16.0,
            right: 16.0,
            top: 12.0,
            bottom: 12.0,
          ),
          child: TextButton(
            onPressed: () => _deleteCartConfirmation(context),
            child: Text(
              trans(context, 'cart.deleteCart'),
              style: Fonts.satoshi(
                fontSize: 16,
                fontWeight: FontWeight.w400,
                color: theme.secondary64,
              ),
            ),
          ),
        )
      ],
    );
  }

  void _deleteCartConfirmation(BuildContext context) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text(
            transEx(context, 'cart.deleteCartTitle'),
            style: Fonts.satoshi(
              fontSize: 17,
              fontWeight: FontWeight.w600,
              color: theme.secondary,
            ),
          ),
          content: Text(
            transEx(context, 'cart.deleteCartMessage'),
            style: Fonts.satoshi(
              fontSize: 13,
              fontWeight: FontWeight.w400,
              color: theme.secondary,
            ),
          ),
          actions: [
            TextButton(
              child: Text(
                transEx(context, 'cart.deleteCartCancel'),
                style: Fonts.satoshi(
                  fontSize: 17,
                  fontWeight: FontWeight.w400,
                  color: theme.secondary,
                ),
              ),
              onPressed: () {
                Nav.pop();
              },
            ),
            TextButton(
              child: Text(
                transEx(context, 'cart.deleteCartAccept'),
                style: Fonts.satoshi(
                  fontSize: 17,
                  fontWeight: FontWeight.w600,
                  color: theme.primary,
                ),
              ),
              onPressed: () async {
                Nav.reset(MainNavigation());
                getIt<CartBloc>().add(ClearCartAction());
              },
            ),
          ],
        );
      },
    );
  }

  Widget _buildCartItem(BuildContext context, GeoUnit unit, OrderItem order) {
    // print('_buildCartItem()=$order');
    return SlideAnimation(
      verticalOffset: 50.0,
      child: FadeInAnimation(
        child: Container(
          margin: EdgeInsets.only(right: 4.0),
          child: CartListItemWidget(
            unit: unit,
            order: order,
          ),
        ),
      ),
    );
  }

  Widget _emptyCart(BuildContext context) {
    return EmptyWidget(
      messageKey: 'cart.emptyCartLine1',
      descriptionKey: 'cart.emptyCartLine2',
    );
  }
}
