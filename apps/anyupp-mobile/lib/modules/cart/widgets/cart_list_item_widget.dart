import '/core/core.dart';
import '/core/theme/theme.dart';
import '/models.dart';
import '/modules/cart/cart.dart';
import '/shared/locale.dart';
import '/shared/utils/format_utils.dart';
import '/shared/utils/unit_utils.dart';
import '/shared/widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '/graphql/generated/crud-api.dart';

// Represents one row (one sandwich) in cart page
class CartListItemWidget extends StatefulWidget {
  final Unit unit;
  final OrderItem order;
  final ServingMode servingMode;
  CartListItemWidget(
      {required this.unit, required this.order, required this.servingMode});

  @override
  _CartListItemWidgetState createState() => _CartListItemWidgetState();
}

class _CartListItemWidgetState extends State<CartListItemWidget> {
  Widget build(BuildContext context) {
    return Stack(
      children: [
        Container(
          child: Row(
            mainAxisAlignment: MainAxisAlignment.start,
            children: [
              Container(
                padding: EdgeInsets.only(
                  top: 8,
                  // bottom: 8.0,
                  left: 16,
                  right: 16,
                ),
                //width: 100,
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(
                    8.0,
                  ),
                  // child: ProductImageWidget(
                  //   url: this.widget.order.image!,
                  //   width: 130,
                  //   height: 130,
                  //   fit: BoxFit.cover,
                  // ),
                  child: ImageWidget(
                    url: this.widget.order.image,
                    placeholder: CircularProgressIndicator(),
                    errorWidget: Icon(Icons.error),
                    fit: BoxFit.contain,
                    width: 112,
                    height: 112,
                  ),
                ),
              ),
              Expanded(
                child: Column(
                  // fit: StackFit.passthrough,
                  children: <Widget>[
                    Container(
                      // width: double.infinity,
                      margin: EdgeInsets.only(right: 10.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          SizedBox(
                            height: 16,
                          ),
                          Text(
                            getLocalizedText(context,
                                widget.order.productName), // .toUpperCase(),
                            textAlign: TextAlign.left,
                            style: Fonts.hH3(
                              color: theme.secondary,
                            ),
                          ),
                          Text(
                            "${getLocalizedText(context, widget.order.variantName)}",
                            textAlign: TextAlign.left,
                            style: Fonts.pP1(
                              color: theme.secondary,
                            ),
                          ),
                          ..._getExtraNames(context),
                          // getOrderItemAllergenWidget(),
                          SizedBox(
                            height: 16,
                          ),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              RichText(
                                text: TextSpan(
                                  text: '${widget.order.quantity}',
                                  style: Fonts.satoshi(
                                    color: theme.highlight,
                                    fontSize: 14,
                                    fontWeight: FontWeight.w700,
                                  ),
                                  children: <TextSpan>[
                                    TextSpan(
                                      text: '  x  ',
                                      style: Fonts.satoshi(
                                        color: theme.secondary40,
                                        fontSize: 14,
                                        fontWeight: FontWeight.w700,
                                      ),
                                    ),
                                    TextSpan(
                                      text: formatCurrency(
                                          widget.order.getPrice(
                                              currentUnit?.serviceFeePolicy),
                                          widget.unit.currency),
                                      style: Fonts.satoshi(
                                        color: theme.highlight,
                                        fontSize: 14,
                                        fontWeight: FontWeight.w700,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              // Spacer(),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
        Positioned(
          bottom: 0.0,
          right: 16.0,
          child: BlocBuilder<CartBloc, BaseCartState>(
            builder: (context, state) {
              bool showAddLoading = state is CartLoadingState &&
                  state.message == 'add' &&
                  state.productId == widget.order.productId;
              bool showRemoveLoading = state is CartLoadingState &&
                  state.message == 'remove' &&
                  state.productId == widget.order.productId;
              bool diasbleTap = showAddLoading || showRemoveLoading;

              return Row(
                mainAxisAlignment: MainAxisAlignment.start,
                children: [
                  BorderedWidget(
                    width: 40,
                    height: 40,
                    borderColor: theme.secondary16,
                    child: showRemoveLoading
                        ? CenterLoadingWidget(
                            size: 16,
                            strokeWidth: 1.0,
                          )
                        : Icon(
                            Icons.remove,
                            color: theme.secondary,
                          ),
                    onPressed: () => diasbleTap ? null : _removeOrder(),
                  ),
                  SizedBox(
                    width: 12,
                  ),
                  BorderedWidget(
                    width: 40,
                    height: 40,
                    borderColor: theme.secondary16,
                    child: showAddLoading
                        ? CenterLoadingWidget(
                            size: 16,
                            strokeWidth: 1.0,
                          )
                        : Icon(
                            Icons.add,
                            color: theme.secondary,
                          ),
                    onPressed: () => diasbleTap ? null : _addOrder(),
                  ),
                ],
              );
            },
          ),
        ),
      ],
    );
  }

  List<Widget> _getExtraNames(BuildContext context) {
    List<Widget> children = [];
    if (widget.order.selectedConfigMap != null) {
      widget.order.selectedConfigMap!.forEach((key, value) {
        for (ProductConfigComponent generatedProductConfigComponent
            in value) {
          children.add(Text(
            '+ ${getLocalizedText(context, generatedProductConfigComponent.name)}',
            textAlign: TextAlign.left,
            style: Fonts.satoshi(
              color: theme.secondary,
              fontWeight: FontWeight.normal,
              fontSize: 14,
            ),
          ));
        }
      });

      // if (widget.servingMode == ServingMode.takeAway) {
      //   children.add(Text(
      //     '+ ' + trans('cart.packagingFee'),
      //     textAlign: TextAlign.left,
      //     style: Fonts.satoshi(
      //       color: theme.secondary,
      //       fontWeight: FontWeight.normal,
      //       fontSize: 14,
      //     ),
      //   ));
      // }
    } else {
      children.add(Container());
    }

    return children;
  }

  void _addOrder() {
    BlocProvider.of<CartBloc>(context).add(AddProductToCartAction(
        widget.unit,
        widget.order.copyWith(
          quantity: 1,
        )));
  }

  void _removeOrder() {
    BlocProvider.of<CartBloc>(context)
        .add(RemoveProductFromCartAction(widget.unit.id, widget.order));
  }
}
