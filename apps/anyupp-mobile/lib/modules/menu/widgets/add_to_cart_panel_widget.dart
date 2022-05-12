import 'dart:io';
import 'dart:math';

import 'package:fa_prev/models.dart';
import 'package:fa_prev/shared/utils/format_utils.dart';
import 'package:fa_prev/shared/utils/unit_utils.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/core/theme/theme.dart';
import 'package:fa_prev/modules/menu/menu.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/shared/widgets.dart';
import 'package:fa_prev/graphql/generated/crud-api.dart';

class AddToCartPanelWidget extends StatefulWidget {
  final Function(ConfigsetUpdated state, int quantity)? onAddToCartPressed;
  final ProductItemDisplayState displayState;
  final ServingMode? servingMode;
  final ServiceFeePolicy? serviceFeePolicy;

  const AddToCartPanelWidget({
    Key? key,
    this.onAddToCartPressed,
    this.displayState = ProductItemDisplayState.NORMAL,
    this.servingMode,
    this.serviceFeePolicy,
  }) : super(key: key);

  @override
  _AddToCartPanelWidgetState createState() => _AddToCartPanelWidgetState();
}

class _AddToCartPanelWidgetState extends State<AddToCartPanelWidget> {
  int _quantity = 1;
  bool _showTooltip = false;
  ServiceFeeType? serviceFeeType;

  @override
  void initState() {
    super.initState();
    serviceFeeType = widget.serviceFeePolicy?.type;
    _showTooltip = serviceFeeType == ServiceFeeType.included ||
        serviceFeeType == ServiceFeeType.applicable;
    Future.delayed(const Duration(seconds: 5), () {
      if (this.mounted) {
        setState(() {
          _showTooltip = false;
        });
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<ConfigsetBloc, ConfigsetState>(
      builder: (context, state) {
        if (state is ConfigsetUpdated) {
          return _buildAddToCartPanel(context, state);
        } else {
          return SizedBox();
        }
      },
    );
  }

  Widget _buildAddToCartPanel(BuildContext context, ConfigsetUpdated state) {
    String price =
        formatCurrency(state.totalPrice * serviceFeeMul, state.unit.currency);

    String serviceFeeMessage = serviceFeeType == ServiceFeeType.included
        ? trans('cart.hasServiceFee')
        : serviceFeeType == ServiceFeeType.applicable
            ? trans('cart.hasServiceFeeNotIncluded',
                [widget.serviceFeePolicy?.percentage.toInt() ?? 0])
            : trans('cart.hasNoServiceFee');

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
            child: widget.displayState == ProductItemDisplayState.NORMAL &&
                    _showTooltip &&
                    widget.servingMode == ServingMode.inPlace
                ? TooltipWidget(
                    text: serviceFeeMessage,
                    child: widget.displayState == ProductItemDisplayState.NORMAL
                        ? _buildButtonRow(price)
                        : _buildNotAvailableInfo(),
                  )
                : widget.displayState == ProductItemDisplayState.NORMAL
                    ? _buildButtonRow(price)
                    : _buildNotAvailableInfo(),
          ),
          Platform.isIOS
              ? Container(
                  margin: EdgeInsets.only(bottom: 20.0),
                  child: AddToCartPanelButtonWidget(
                    widget: widget,
                    quantity: _quantity,
                    state: state,
                  ),
                )
              : AddToCartPanelButtonWidget(
                  widget: widget,
                  quantity: _quantity,
                  state: state,
                ),
        ],
      ),
    );
  }

  Widget _buildNotAvailableInfo() {
    print(
        '_buildNotAvailableInfo().displayState=${widget.displayState}, servingMode=${widget.servingMode}');
    return Text(
      widget.displayState == ProductItemDisplayState.DISABLED
          ? widget.servingMode == ServingMode.takeAway
              ? trans('product.notTakeAwayDesc')
              : trans('product.notInPlaceDesc')
          : trans('product.soldOutDesc'),
      style: Fonts.satoshi(
        fontSize: 14.0,
        fontWeight: FontWeight.w700,
        color: isDisabled ? theme.secondary.withOpacity(0.4) : theme.secondary,
      ),
    );
  }

  bool get isDisabled =>
      widget.displayState == ProductItemDisplayState.DISABLED ||
      widget.displayState == ProductItemDisplayState.SOLDOUT;

  Widget _buildButtonRow(String price) {
    return Row(
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
          child: RichText(
            text: TextSpan(
              text: '$_quantity',
              style: Fonts.satoshi(
                color: theme.highlight,
                fontSize: 16.0,
                fontWeight: FontWeight.w700,
              ),
              children: <TextSpan>[
                TextSpan(
                  text: ' x ',
                  style: Fonts.satoshi(
                    color: theme.secondary40,
                    fontSize: 16.0,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                TextSpan(
                  text: price,
                  style: Fonts.satoshi(
                    color: theme.highlight,
                    fontSize: 16.0,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ],
            ),
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

class AddToCartPanelButtonWidget extends StatelessWidget {
  const AddToCartPanelButtonWidget({
    Key? key,
    required this.widget,
    required int quantity,
    required this.state,
  })  : _quantity = quantity,
        super(key: key);

  final AddToCartPanelWidget widget;
  final ConfigsetUpdated state;
  final int _quantity;

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 56.0,
      child: ElevatedButton(
        style: ElevatedButton.styleFrom(
          primary: theme.button,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(
              40,
            ),
          ),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              trans(context, "cart.addToCart").toUpperCase(),
              style: Fonts.satoshi(
                fontSize: 16.0,
                fontWeight: FontWeight.w700,
                color: theme.buttonText,
              ),
            ),
          ],
        ),
        onPressed: widget.onAddToCartPressed != null &&
                widget.displayState == ProductItemDisplayState.NORMAL
            ? () => widget.onAddToCartPressed!(state, _quantity)
            : null,
      ),
    );
  }
}
