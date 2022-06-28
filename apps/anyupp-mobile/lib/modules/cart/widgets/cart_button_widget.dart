import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/cart/cart.dart';
import 'package:fa_prev/modules/selectunit/selectunit.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/shared/nav.dart';
import 'package:fa_prev/shared/utils/format_utils.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class CartButtonWidget extends StatefulWidget {
  final AnimationController controller;
  final bool showQRScanButton;

  const CartButtonWidget({
    Key? key,
    required this.controller,
    this.showQRScanButton = true,
  }) : super(key: key);

  @override
  _CartButtonWidgetState createState() => _CartButtonWidgetState();
}

class _CartButtonWidgetState extends State<CartButtonWidget>
    with SingleTickerProviderStateMixin {
  late Animation<Offset> _offset;

  @override
  void initState() {
    super.initState();

    // _controller = AnimationController(vsync: this, duration: Duration(seconds: 1));
    // _offset = Tween<Offset>(begin: Offset(0.0, 1.0), end: Offset(0.0, 0.0)).animate(widget.controller);
    _offset = Tween<Offset>(
      begin: const Offset(0, 1.76),
      end: const Offset(0, 0),
    ).animate(CurvedAnimation(
      parent: widget.controller,
      curve: Curves.decelerate,
    ));
    // widget.controller.forward();
  }

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<UnitSelectBloc, UnitSelectState>(
      builder: (context, state) {
        if (state is UnitSelected) {
          return StreamBuilder<Cart?>(
            stream: getIt<CartRepository>().getCurrentCartStream(state.unit.id),
            builder: (context, AsyncSnapshot<Cart?> snapshot) {
              // log.d('CartScreen.snapshot=$snapshot');
              if (snapshot.connectionState != ConnectionState.waiting ||
                  snapshot.hasData) {
                if (snapshot.data != null &&
                    snapshot.data?.items.isNotEmpty == true) {
                  return _buildButtons(context, state.unit, snapshot.data);
                }
                return _buildButtons(context);
              }

              return _buildButtons(context);
              // return CenterLoadingWidget(
              //   color: theme.secondary0,
              // );
            },
          );
        }
        return Container(
          width: double.infinity,
          child: _buildQRScanButton(context),
        );
      },
    );
  }

  Widget _buildButtons(BuildContext context, [GeoUnit? unit, Cart? cart]) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.end,
      children: [
        if (widget.showQRScanButton) _buildQRScanButton(context),
        if (cart != null && unit != null)
          _buildPaymentButton(context, unit, cart),
      ],
    );
  }

  Widget _buildQRScanButton(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16.0, right: 16.0),
      child: FloatingActionButton(
        backgroundColor: theme.button,
        child: Icon(
          Icons.qr_code_scanner,
          color: theme.secondary0,
        ),
        onPressed: () => showQRScannerModal(context, true),
      ),
    );
  }

  Widget _buildPaymentButton(BuildContext context, GeoUnit unit, Cart cart) {
    return SlideTransition(
      position: _offset,
      child: Container(
        height: 56.0,
        width: double.infinity,
        margin: EdgeInsets.symmetric(
          horizontal: 16.0,
        ),
        child: ElevatedButton(
          onPressed: () => Nav.to(
            CartScreen(),
            animationType: NavAnim.SLIDEIN_DOWN,
          ),
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
                    // trans("cart.addToCart").toUpperCase(),
                    '${trans("cart.myCart")} (${formatCurrency(cart.totalPrice, unit.currency)})',
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
                  child: Icon(
                    Icons.arrow_forward,
                    color: theme.buttonText,
                  ),
                ),
              )
            ],
          ),
        ),
      ),
    );
  }
}
