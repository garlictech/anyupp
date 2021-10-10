import 'package:fa_prev/core/dependency_indjection/dependency_injection.dart';
import 'package:fa_prev/core/theme/theme.dart';
import 'package:fa_prev/core/units/units.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/cart/cart.dart';
import 'package:fa_prev/modules/selectunit/screens/flutter_qr_code_scanner.dart';
import 'package:fa_prev/modules/takeaway/takeaway.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/shared/utils/format_utils.dart';
import 'package:fa_prev/shared/utils/navigator.dart';
import 'package:fa_prev/shared/utils/place_preferences.dart';
import 'package:fa_prev/shared/utils/stage_utils.dart';
import 'package:fa_prev/shared/widgets.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_staggered_animations/flutter_staggered_animations.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:fa_prev/graphql/generated/crud-api.dart' hide Allergen;

class CartScreen extends StatefulWidget {
  @override
  State<CartScreen> createState() => _CartScreenState();
}

class _CartScreenState extends State<CartScreen> {
  late ScrollController _controller;

  @override
  void initState() {
    super.initState();
    _controller = ScrollController();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: theme.secondary0,
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        backgroundColor: theme.secondary0,
        centerTitle: true,
        elevation: 1.0,
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
              return Container(
                margin: EdgeInsets.only(top: 12.0, bottom: 12.0, right: 16.0),
                child: BorderedWidget(
                  onPressed: null,
                  borderColor: theme.secondary12,
                  color: theme.secondary12,
                  // width: 40.0,
                  height: 30,
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 12.0),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        state.servingMode == ServingMode.takeAway
                            ? SvgPicture.asset(
                                "assets/icons/bag.svg",
                                color: theme.secondary,
                              )
                            : Padding(
                                padding: const EdgeInsets.all(6.0),
                                child: SvgPicture.asset(
                                  'assets/icons/restaurant_menu_black.svg',
                                ),
                              ),
                        SizedBox(
                          width: 4.0,
                        ),
                        Text(
                          state.servingMode == ServingMode.takeAway
                              ? trans('cart.takeAway')
                              : trans('cart.inPlace'),
                          style: Fonts.satoshi(
                            fontSize: 14.0,
                            color: theme.secondary,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              );
            }
            return Container();
          }),
        ],
        // Only dev and qa builds are show the table and seat in the top right corner
        title: (true)
            ? FutureBuilder<Place?>(
                future: getPlacePref(),
                builder: (BuildContext context,
                    AsyncSnapshot<Place?> placeSnapshot) {
                  // print('placeSnapshot=$placeSnapshot');

                  if (placeSnapshot.hasData) {
                    return Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          trans('main.menu.cart'),
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
                              ' ${placeSnapshot.data?.table}',
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
                              '${placeSnapshot.data?.seat}',
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

                  return Text(
                    trans('main.menu.cart'),
                    style: Fonts.satoshi(
                      color: theme.secondary,
                      fontSize: 16.0,
                      fontWeight: FontWeight.w400,
                    ),
                  );
                },
              )
            // ignore: dead_code
            : Text(
                trans('main.menu.cart'),
                style: Fonts.satoshi(
                  color: theme.secondary,
                  fontSize: 16.0,
                  fontWeight: FontWeight.w400,
                ),
              ),
      ),
      body: BlocBuilder<UnitSelectBloc, UnitSelectState>(
        builder: (context, state) {
          if (state is UnitSelected) {
            return StreamBuilder<Cart?>(
              stream:
                  getIt<CartRepository>().getCurrentCartStream(state.unit.id),
              builder: (context, AsyncSnapshot<Cart?> snapshot) {
                // print('CartScreen.snapshot=$snapshot');
                if (snapshot.connectionState != ConnectionState.waiting ||
                    snapshot.hasData) {
                  if (snapshot.data != null &&
                      snapshot.data?.items.isNotEmpty == true) {
                    return _buildCartListAndTotal(
                        context, state.unit, snapshot.data!);
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
            padding: EdgeInsets.only(
                left: 15, right: 2), // EdgeInsets.symmetric(horizontal: 15),
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

  Widget _buildPaymentButtonPanel(
      BuildContext context, GeoUnit unit, Cart cart) {
    bool showQrCodeScan = true;
    if ((cart.place == null ||
            (cart.place?.seat == "00" && cart.place?.table == "00")) &&
        isDev) {
      showQrCodeScan = false;
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
                  ))
                : showSelectPaymentMethodBottomSheet(context),
            style: ElevatedButton.styleFrom(
              primary: theme.primary,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(10),
              ),
            ),
            child: Stack(
              fit: StackFit.expand,
              children: [
                Positioned.fill(
                  child: Align(
                    alignment: Alignment.center,
                    child: Text(
                      //trans("cart.addToCart").toUpperCase(),
                      '${trans("cart.pay")} (${formatCurrency(cart.totalPrice, unit.currency)})',
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
              trans('cart.deleteCart'),
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
                Navigator.pop(context);
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
                Nav.pop();
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
