import 'package:fa_prev/core/dependency_indjection/dependency_injection.dart';
import 'package:fa_prev/core/theme/theme.dart';
import 'package:fa_prev/core/units/units.dart';
import 'package:fa_prev/graphql/generated/crud-api.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/cart/cart.dart';
import 'package:fa_prev/modules/main/main.dart';
import 'package:fa_prev/modules/payment/payment.dart';
import 'package:fa_prev/modules/takeaway/takeaway.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/shared/utils/format_utils.dart';
import 'package:fa_prev/shared/utils/navigator.dart';
import 'package:fa_prev/shared/utils/stage_utils.dart';
import 'package:fa_prev/shared/widgets.dart';
import 'package:fa_prev/shared/widgets/platform_alert_dialog.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_staggered_animations/flutter_staggered_animations.dart';
import 'package:flutter_svg/flutter_svg.dart';

import 'select_payment_method_screen.dart';

class CartScreen extends StatelessWidget {
  final ScrollController _controller = ScrollController();

  @override
  Widget build(BuildContext context) {
    return BlocListener<StripePaymentBloc, StripePaymentState>(
      listener: (context, state) {
        // if (state is StripeOperationSuccess || state is StripeError) {
        //   // Go to Orders when payment finished
        //   Future.delayed(Duration(milliseconds: 500)).then((value) {
        //     getIt<MainNavigationBloc>().add(DoMainNavigation(pageIndex: 2));
        //     Nav.pop();
        //   });
        // }
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
              showBorder: true,
              icon: Icons.arrow_back,
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
                        initialPosition:
                            state.servingMode == ServingMode.inPlace ? 0 : 1,
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
                  stream: getIt<CartRepository>()
                      .getCurrentCartStream(state.unit.id),
                  builder: (context, AsyncSnapshot<Cart?> snapshot) {
                    Place? place = snapshot.data?.place;
                    if (snapshot.hasData) {
                      bool show = place?.isNotEmpty == true && isDev;

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
                                color: theme.icon,
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
                                color: theme.icon,
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
                  stream: getIt<CartRepository>()
                      .getCurrentCartStream(state.unit.id),
                  builder: (context, AsyncSnapshot<Cart?> snapshot) {
                    if (snapshot.connectionState != ConnectionState.waiting ||
                        snapshot.hasData) {
                      if (snapshot.data?.items.isNotEmpty == true) {
                        return _buildCartListAndTotal(
                            context, state.unit, snapshot.data!);
                      }
                      return EmptyWidget(
                        messageKey: 'cart.emptyCartLine1',
                        descriptionKey: 'cart.emptyCartLine2',
                      );
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
    // log.d('_buildCartListAndTotal()=${cart.servingMode}');
    Map<int, Allergen> cartAllergens = {};
    for (OrderItem item in cart.items) {
      if (item.allergens != null) {
        for (Allergen allergen in item.allergens!) {
          cartAllergens[allergenMap[allergen]!] = allergen;
        }
      }
      if (item.selectedConfigMap != null) {
        item.selectedConfigMap!.forEach((key, value) {
          for (GeneratedProductConfigComponent component in value) {
            if (component.allergens != null) {
              for (Allergen allergen in component.allergens!) {
                // String temp = allergen.toString().split(".").last;
                cartAllergens[allergenMap[allergen]!] = allergen;
              }
            }
          }
        });
      }
    }

    bool isTakeAway = cart.servingMode == ServingMode.takeAway;
    bool isServiceFee =
        unit.serviceFeePolicy?.type == ServiceFeeType.applicable && !isTakeAway;
    int additionalRowCount = (isServiceFee ? 1 : 0) + (isTakeAway ? 1 : 0);

    return Column(
      children: <Widget>[
        // LIST
        Expanded(
          flex: 10,
          child: AnimationLimiter(
            child: RawScrollbar(
              controller: _controller,
              thumbColor: theme.secondary.withOpacity(0.2),
              radius: Radius.circular(20),
              thumbVisibility: true,
              thickness: 4,
              child: ListView.separated(
                separatorBuilder: (context, index) => Divider(
                  color: theme.secondary64.withOpacity(0.3),
                ),
                controller: _controller,
                shrinkWrap: true,
                physics: BouncingScrollPhysics(),
                itemCount: cart.items.length + additionalRowCount,
                itemBuilder: (context, position) {
                  if (isTakeAway && position == cart.items.length) {
                    return AnimationConfiguration.staggeredList(
                        position: position,
                        duration: const Duration(milliseconds: 200),
                        child: _buildPackagingFeeItem(
                            context, cart, unit, !isServiceFee));
                  }

                  if (isServiceFee &&
                      position == cart.items.length + additionalRowCount - 1) {
                    return AnimationConfiguration.staggeredList(
                        position: position,
                        duration: const Duration(milliseconds: 200),
                        child: _buildServiceFeeItem(context, cart, unit));
                  }

                  final OrderItem order = cart.items[position];
                  return AnimationConfiguration.staggeredList(
                    position: position,
                    duration: const Duration(milliseconds: 200),
                    child:
                        _buildCartItem(context, unit, order, cart.servingMode),
                  );
                },
              ),
            ),
          ),
        ),
        _buildPaymentButtonPanel(context, unit, cart),
      ],
    );
  }

  Widget _buildPaymentButtonPanel(
    BuildContext context,
    GeoUnit unit,
    Cart cart,
  ) {
    bool showQrCodeScan = cart.isPlaceEmpty;
    // log.d('_buildPaymentButtonPanel().cart.orderPolicy=${cart.orderPolicy}');
    // log.d('_buildPaymentButtonPanel().cart.place.empty=$showQrCodeScan');
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
            onPressed: () =>
                _handlePaymentButtonPressed(unit, cart, showQrCodeScan),
            style: ElevatedButton.styleFrom(
              primary: theme.button,
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
                      key: const Key('cart-totalprice-text'),
                      style: Fonts.satoshi(
                        fontSize: 16.0,
                        fontWeight: FontWeight.w700,
                        color: theme.buttonText,
                      ),
                    ),
                  ),
                ),
                Positioned.fill(
                  child: Align(
                    alignment: Alignment.centerRight,
                    child: cart.isPlaceEmpty &&
                            cart.orderPolicy == OrderPolicy.placeOnly
                        ? SvgPicture.asset(
                            'assets/icons/qr_code_scanner.svg',
                            color: theme.secondary0,
                          )
                        : Icon(
                            Icons.arrow_forward,
                            color: theme.buttonText,
                          ),
                  ),
                ),
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
        return PlatformAlertDialog(
            title: transEx(context, 'cart.deleteCartTitle'),
            description: transEx(context, 'cart.deleteCartMessage'),
            cancelButtonText: transEx(context, 'cart.deleteCartCancel'),
            okButtonText: transEx(context, 'cart.deleteCartAccept'),
            onOkPressed: () async {
              Nav.reset(MainNavigation());
              getIt<CartBloc>().add(ClearCartAction());
            },
            onCancelPressed: () {
              Nav.pop();
            });
      },
    );
  }

  Widget _buildServiceFeeItem(BuildContext context, Cart cart, GeoUnit unit) {
    return SlideAnimation(
      verticalOffset: 50.0,
      child: FadeInAnimation(
        child: Column(
          children: [
            Container(
              padding: EdgeInsets.only(
                top: 8,
                // bottom: 8.0,
                left: 16,
                right: 16,
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.start,
                children: [
                  Container(
                    width: 112,
                    height: 88,
                    margin: EdgeInsets.only(right: 16.0),
                    child: Center(
                      child: Icon(
                        Icons.room_service,
                        color: theme.secondary,
                        size: 32,
                      ),
                    ),
                  ),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          child: Text(
                            trans(context, 'cart.serviceFee'),
                            textAlign: TextAlign.left,
                            style: Fonts.satoshi(
                              color: theme.secondary,
                              fontWeight: FontWeight.w700,
                              fontSize: 18,
                            ),
                          ),
                        ),
                        SizedBox(
                          height: 16,
                        ),
                        Text(
                          '${formatCurrency(cart.totalServiceFee, unit.currency)} (${formatDouble(unit.serviceFeePolicy!.percentage)} %)',
                          key: const Key('cart-servicefee-text'),
                          style: Fonts.satoshi(
                            color: theme.highlight,
                            fontSize: 14,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            Divider(
              height: 1.0,
              color: theme.secondary16,
            )
          ],
        ),
      ),
    );
  }

  Widget _buildPackagingFeeItem(BuildContext context, Cart cart, GeoUnit unit,
      [bool showSeparator = true]) {
    return SlideAnimation(
      verticalOffset: 50.0,
      child: FadeInAnimation(
        child: Column(
          children: [
            Container(
              padding: EdgeInsets.only(
                top: 8,
                // bottom: 8.0,
                left: 16,
                right: 16,
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.start,
                children: [
                  Container(
                    width: 112,
                    height: 88,
                    margin: EdgeInsets.only(right: 16.0),
                    child: Center(
                      child: SvgPicture.asset(
                        'assets/icons/takeaway-fee.svg',
                        color: theme.secondary,
                      ),
                    ),
                  ),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          child: Text(
                            trans(context, 'cart.packagingFee'),
                            textAlign: TextAlign.left,
                            style: Fonts.satoshi(
                              color: theme.secondary,
                              fontWeight: FontWeight.w700,
                              fontSize: 18,
                            ),
                          ),
                        ),
                        SizedBox(
                          height: 16,
                        ),
                        Text(
                          formatCurrency(cart.packaginFee, unit.currency),
                          key: const Key('cart-packagingfee-text'),
                          style: Fonts.satoshi(
                            color: theme.highlight,
                            fontSize: 14,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            if (showSeparator)
              Divider(
                height: 1.0,
                color: theme.secondary16,
              )
          ],
        ),
      ),
    );
  }

  Widget _buildCartItem(BuildContext context, GeoUnit unit, OrderItem order,
      ServingMode servingMode) {
    // log.d('_buildCartItem()=$order');
    return SlideAnimation(
      verticalOffset: 50.0,
      child: FadeInAnimation(
        child: Container(
          margin: EdgeInsets.only(right: 4.0),
          child: CartListItemWidget(
            unit: unit,
            order: order,
            servingMode: servingMode,
          ),
        ),
      ),
    );
  }

  _handlePaymentButtonPressed(
    GeoUnit unit,
    Cart cart,
    bool showQrCodeScan,
  ) async {
    Nav.to(
      SelectPaymentMethodScreen(cart: cart, unit: unit),
      animationType: NavAnim.SLIDEIN_DOWN,
    );
  }
}
