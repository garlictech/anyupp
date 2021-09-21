import 'package:fa_prev/core/dependency_indjection/dependency_injection.dart';
import 'package:fa_prev/core/theme/theme.dart';
import 'package:fa_prev/core/units/units.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/cart/cart.dart';
import 'package:fa_prev/modules/menu/widgets/allergens_widget.dart';
import 'package:fa_prev/modules/selectunit/screens/flutter_qr_code_scanner.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/shared/utils/format_utils.dart';
import 'package:fa_prev/shared/utils/navigator.dart';
import 'package:fa_prev/shared/utils/place_preferences.dart';
import 'package:fa_prev/shared/utils/stage_utils.dart';
import 'package:fa_prev/shared/widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_staggered_animations/flutter_staggered_animations.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:google_fonts/google_fonts.dart';

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
      backgroundColor: theme.background,
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        backgroundColor: theme.background,
        centerTitle: false,
        elevation: 5.0,
        // Only dev and qa builds are show the table and seat in the top right corner
        title: (true)
            ? FutureBuilder<Place?>(
                future: getPlacePref(),
                builder: (BuildContext context, AsyncSnapshot<Place?> placeSnapshot) {
                  // print('placeSnapshot=$placeSnapshot');

                  if (placeSnapshot.hasData) {
                    return Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          trans('main.menu.cart'),
                          style: GoogleFonts.poppins(
                            color: theme.text,
                            fontSize: 22.0,
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
                              color: theme.indicator,
                            ),
                            Text(
                              ' ${placeSnapshot.data?.table}',
                              style: GoogleFonts.poppins(
                                color: theme.text,
                                fontSize: 14.0,
                                fontWeight: FontWeight.w400,
                              ),
                            ),
                            SvgPicture.asset(
                              'assets/icons/chair-icon.svg',
                              width: 20,
                              height: 20,
                              color: theme.indicator,
                            ),
                            Text(
                              '${placeSnapshot.data?.seat}',
                              style: GoogleFonts.poppins(
                                color: theme.text,
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
                    style: GoogleFonts.poppins(
                      color: theme.text,
                      fontSize: 22.0,
                      fontWeight: FontWeight.w600,
                    ),
                  );
                },
              )
            // ignore: dead_code
            : Text(
                trans('main.menu.cart'),
                style: GoogleFonts.poppins(
                  color: theme.text,
                  fontSize: 22.0,
                  fontWeight: FontWeight.w600,
                ),
              ),
      ),
      body: BlocBuilder<UnitSelectBloc, UnitSelectState>(
        builder: (context, state) {
          if (state is UnitSelected) {
            return StreamBuilder<Cart?>(
              stream: getIt<CartRepository>().getCurrentCartStream(state.unit.id!),
              builder: (context, AsyncSnapshot<Cart?> snapshot) {
                // print('CartScreen.snapshot=$snapshot');
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
    );
  }

  Widget _buildCartListAndTotal(BuildContext context, GeoUnit unit, Cart cart) {
    bool showQrCodeScan = false;
    if ((cart.place == null || (cart.place?.seat == "00" && cart.place?.table == "00")) && !isDev) {
      showQrCodeScan = true;
    }

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
            padding: EdgeInsets.only(left: 15, right: 2), // EdgeInsets.symmetric(horizontal: 15),
            child: AnimationLimiter(
              child: RawScrollbar(
                controller: _controller,
                thumbColor: theme.text.withOpacity(0.2),
                radius: Radius.circular(20),
                isAlwaysShown: true,
                thickness: 4,
                child: ListView.separated(
                  separatorBuilder: (context, index) => Divider(
                    color: theme.disabled.withOpacity(0.3),
                  ),
                  controller: _controller,
                  shrinkWrap: true,
                  physics: BouncingScrollPhysics(),
                  itemCount: cart.items.length,
                  itemBuilder: (context, position) {
                    final OrderItem order = cart.items[position];
                    return AnimationConfiguration.staggeredList(
                      position: position,
                      duration: const Duration(milliseconds: 375),
                      child: _buildCartItem(context, unit, order),
                    );
                  },
                ),
              ),
            ),
          ),
        ),
        cartAllergens.keys.toList().isNotEmpty
            ? Column(
                children: [
                  SizedBox(
                    height: 2.0,
                    child: Container(
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          begin: Alignment.topLeft,
                          end: Alignment.bottomLeft,
                          colors: [
                            theme.text.withOpacity(0.4),
                            Colors.transparent,
                          ],
                        ),
                      ),
                    ),
                  ),
                  AllergensWidget(allergens: cartAllergens.values.toList()),
                ],
              )
            : Container(),
        // TOTAL
        Container(
          height: 94,
          padding: EdgeInsets.only(left: 30, top: 20, right: 15, bottom: 15),
          decoration: BoxDecoration(color: theme.background2),
          child: Row(
            children: <Widget>[
              Expanded(
                child: Align(
                  alignment: Alignment.centerLeft,
                  child: Row(
                    //crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.start,
                    children: <Widget>[
                      Text(
                        trans('cart.totalCost'),
                        style: GoogleFonts.poppins(
                          color: theme.text,
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      // Display the overall cart price
                      Padding(
                        padding: const EdgeInsets.only(left: 8.0),
                        child: Text(
                          formatCurrency(cart.totalPrice, unit.currency),
                          style: GoogleFonts.poppins(
                            color: theme.text,
                            fontSize: 16,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),

              // NAVIGATE TO PAYMENT BUTTON
              Container(
                width: 46,
                height: 46,
                child: TextButton(
                  style: TextButton.styleFrom(
                    padding: EdgeInsets.all(0),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(10.0),
                    ),
                    backgroundColor: theme.indicator,
                    primary: theme.text2,
                  ),
                  onPressed: () => showQrCodeScan
                      ? Nav.to(QRCodeScannerScreen(
                          navigateToCart: true,
                        ))
                      : showSelectPaymentMethodBottomSheet(context),
                  child: showQrCodeScan
                      ? SvgPicture.asset(
                          'assets/icons/qr_code_scanner.svg',
                          color: theme.text2,
                        )
                      : Icon(
                          Icons.arrow_forward,
                          color: theme.text2,
                          // size: 35,
                        ),
                ),
              )
            ],
          ),
        )
      ],
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
