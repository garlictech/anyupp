import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/core/theme/theme.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/cart/cart.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/shared/utils/format_utils.dart';
import 'package:fa_prev/shared/widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

// Represents one row (one sandwich) in cart page
class CartListItemWidget extends StatefulWidget {
  final GeoUnit unit;
  final OrderItem order;
  CartListItemWidget({required this.unit, required this.order});

  @override
  _CartListItemWidgetState createState() => _CartListItemWidgetState();
}

class _CartListItemWidgetState extends State<CartListItemWidget> {
  Widget build(BuildContext context) {
    return Container(
      child: Row(
        children: [
          Expanded(
            flex: 2,
            child: Container(
              padding: EdgeInsets.only(
                top: 8,
                left: 0,
                right: 12,
              ),
              //width: 100,
              child: ClipRRect(
                borderRadius: BorderRadius.circular(
                  8.0,
                ),
                child: ImageWidget(
                  url: this.widget.order.image,
                  placeholder: CircularProgressIndicator(),
                  errorWidget: Icon(Icons.error),
                  fit: BoxFit.cover,
                ),
              ),
            ),
          ),
          Expanded(
            flex: 3,
            child: Column(
              // fit: StackFit.passthrough,
              children: <Widget>[
                Container(
                  margin: EdgeInsets.only(right: 10.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        getLocalizedText(context, widget.order.productName), // .toUpperCase(),
                        textAlign: TextAlign.left,
                        style: Fonts.satoshi(
                          color: theme.secondary,
                          fontWeight: FontWeight.bold,
                          fontSize: 14,
                        ),
                      ),
                      Text(
                        "${getLocalizedText(context, widget.order.variantName)}",
                        textAlign: TextAlign.left,
                        style: Fonts.satoshi(
                          color: theme.secondary,
                          fontWeight: FontWeight.normal,
                          fontSize: 14,
                        ),
                      ),
                      ..._getExtraNames(context),
                      // getOrderItemAllergenWidget(),
                      SizedBox(
                        height: 16,
                      ),
                      Row(
                        children: [
                          RichText(
                            text: TextSpan(
                              text: '${widget.order.quantity}',
                              style: Fonts.satoshi(
                                color: theme.primary,
                                fontSize: 16,
                                fontWeight: FontWeight.w700,
                              ),
                              children: <TextSpan>[
                                TextSpan(
                                  text: ' x ',
                                  style: Fonts.satoshi(
                                    color: theme.secondary40,
                                    fontSize: 16,
                                    fontWeight: FontWeight.w700,
                                  ),
                                ),
                                TextSpan(
                                  text: formatCurrency(widget.order.getPrice(), widget.unit.currency),
                                  style: Fonts.satoshi(
                                    color: theme.primary,
                                    fontSize: 16,
                                    fontWeight: FontWeight.w700,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          Spacer(),
                          BorderedWidget(
                            width: 40,
                            height: 40,
                            borderColor: theme.secondary16,
                            child: Icon(
                              Icons.remove,
                              color: theme.secondary,
                            ),
                            onPressed: () => _removeOrder(),
                          ),
                          SizedBox(
                            width: 16,
                          ),
                          BorderedWidget(
                            width: 40,
                            height: 40,
                            borderColor: theme.secondary16,
                            child: Icon(
                              Icons.add,
                              color: theme.secondary,
                            ),
                            onPressed: () => _addOrder(),
                          ),
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
    );
  }

  List<Widget> _getExtraNames(BuildContext context) {
    List<Widget> children = [];
    if (widget.order.selectedConfigMap != null) {
      widget.order.selectedConfigMap!.forEach((key, value) {
        for (GeneratedProductConfigComponent generatedProductConfigComponent in value) {
          children.add(Text(
            '+${getLocalizedText(context, generatedProductConfigComponent.name)}',
            textAlign: TextAlign.left,
            style: Fonts.satoshi(
              color: theme.secondary,
              fontWeight: FontWeight.normal,
              fontSize: 14,
            ),
          ));
        }
      });
    } else {
      children.add(Container());
    }

    return children;
  }

  void _addOrder() {
    BlocProvider.of<CartBloc>(context).add(AddProductToCartAction(widget.unit.id, widget.order));
  }

  void _removeOrder() {
    BlocProvider.of<CartBloc>(context).add(RemoveProductFromCartAction(widget.unit.id, widget.order));
  }
}
