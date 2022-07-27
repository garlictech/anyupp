import 'package:badges/badges.dart';
import '/core/core.dart';
import '/models.dart';
import '/shared/widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '/modules/cart/cart.dart';

class CartIconWidget extends StatefulWidget {
  final Color color;
  final Color badgeColor;
  final TextStyle badgeStyle;
  final VoidCallback onTapped;

  const CartIconWidget({
    this.color = Colors.white,
    this.badgeColor = Colors.red,
    this.badgeStyle = const TextStyle(color: Colors.white),
    required this.onTapped,
  });
  @override
  _CartIconWidgetState createState() => _CartIconWidgetState();
}

class _CartIconWidgetState extends State<CartIconWidget> {
  @override
  Widget build(BuildContext context) {
    return BlocBuilder<UnitSelectBloc, UnitSelectState>(
      builder: (context, state) {
        if (state is UnitSelected) {
          return StreamBuilder<Cart?>(
            stream: getIt<CartRepository>().getCurrentCartStream(state.unit.id),
            builder: (context, AsyncSnapshot<Cart?> snapshot) {
              if (snapshot.connectionState != ConnectionState.waiting ||
                  snapshot.hasData) {
                if (snapshot.data != null) {
                  return getCartIcon(snapshot.data!.totalCount);
                }
                return getCartIcon(0);
              }
              return CenterLoadingWidget(
                color: theme.highlight,
                size: 20.0,
                strokeWidth: 2.0,
              );
            },
          );
        }
        return CenterLoadingWidget(
          color: theme.highlight,
          size: 20.0,
          strokeWidth: 2.0,
        );
      },
    );

    // return BlocBuilder<CartBloc, BaseCartState>(
    //   builder: (context, state) {
    //     if (state is CurrentCartState) {
    //       return getCartIcon(state.currentCart.totalCount);
    //     }
    //     return getCartIcon(0);
    //   },
    // );
  }

  Widget getCartIcon(int count) {
    if (count == 0) {
      return IconButton(
        icon: Icon(
          Icons.shopping_basket,
          color: widget.color,
        ),
        tooltip: 'Current Cart',
        onPressed: widget.onTapped,
      );
    } else {
      return IconButton(
        icon: Badge(
          elevation: 5.0,
          //padding: EdgeInsets.all(10.0),
          position: BadgePosition.topEnd(),
          animationType: BadgeAnimationType.slide,
          animationDuration: const Duration(seconds: 1),
          badgeContent: Text(
            count.toString(),
            style: widget.badgeStyle,
          ),
          badgeColor: widget.badgeColor,
          child: Icon(
            Icons.shopping_basket,
            color: widget.color,
          ),
        ),
        tooltip: 'Current Cart',
        onPressed: widget.onTapped,
      );
    }
  }
}
