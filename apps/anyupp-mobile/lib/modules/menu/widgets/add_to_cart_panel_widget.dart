import 'dart:math';

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/core/theme/theme.dart';
import 'package:fa_prev/modules/menu/menu.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/shared/widgets.dart';

class AddToCartPanelWidget extends StatefulWidget {
  final Function(ConfigsetUpdated state, int quantity) onAddToCartPressed;

  const AddToCartPanelWidget({
    Key? key,
    required this.onAddToCartPressed,
  }) : super(key: key);

  @override
  _AddToCartPanelWidgetState createState() => _AddToCartPanelWidgetState();
}

class _AddToCartPanelWidgetState extends State<AddToCartPanelWidget> {
  int _quantity = 1;

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<ConfigsetBloc, ConfigsetState>(
      builder: (context, state) {
        if (state is ConfigsetUpdated) {
          return _buildAddToCartPanel(context, state);
        } else {
          return Container();
        }
      },
    );
  }

  Widget _buildAddToCartPanel(BuildContext context, ConfigsetUpdated state) {
    // print('_buildAddToCartPanel()=$state');
    return Container(
      padding: EdgeInsets.all(8.0),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.only(
          topLeft: Radius.circular(16.0),
          topRight: Radius.circular(16.0),
        ),
        boxShadow: [
          BoxShadow(
            color: theme.secondary40,
            offset: Offset(0.0, 1.0),
            blurRadius: 2.0,
          ),
        ],
        color: theme.secondary0,
      ),
      child: Column(
        children: [
          Container(
            padding: EdgeInsets.only(
              top: 16.0,
              bottom: 16.0,
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                BorderedWidget(
                  width: 40,
                  height: 40,
                  borderColor: theme.secondary16,
                  child: Icon(
                    Icons.remove,
                    color: _quantity > 1 ? theme.secondary : theme.secondary16,
                  ),
                  onPressed: () => _decQuantity(),
                ),
                Container(
                  margin: EdgeInsets.only(
                    left: 35,
                    right: 35,
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        '$_quantity',
                        style: Fonts.satoshi(
                          color: theme.primary,
                          fontSize: 16.0,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      Text(
                        '  x  ',
                        style: Fonts.satoshi(
                          color: theme.secondary40,
                          fontSize: 16.0,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      Text(
                        '${state.totalPrice}',
                        style: Fonts.satoshi(
                          color: theme.primary,
                          fontSize: 16.0,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ],
                  ),
                ),
                BorderedWidget(
                  width: 40,
                  height: 40,
                  borderColor: theme.secondary16,
                  child: Icon(
                    Icons.add,
                    color: theme.secondary,
                  ),
                  onPressed: () => _incQuantity(),
                ),
              ],
            ),
          ),
          SafeArea(
            child: Container(
              height: 56.0,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  primary: theme.primary,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10),
                  ),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      trans("cart.addToCart").toUpperCase(),
                      style: Fonts.satoshi(
                        fontSize: 16.0,
                        fontWeight: FontWeight.w700,
                        color: theme.secondary0,
                      ),
                    ),
                  ],
                ),
                onPressed: () => widget.onAddToCartPressed(state, _quantity),
              ),
            ),
          ),
        ],
      ),
    );
  }

  void _incQuantity() {
    print('_addOrder()');
    setState(() {
      _quantity++;
    });
  }

  void _decQuantity() {
    print('_removeOrder()');
    setState(() {
      _quantity = max(_quantity - 1, 1);
    });
  }
}
