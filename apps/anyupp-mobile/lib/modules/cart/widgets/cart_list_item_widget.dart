import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/core/theme/theme.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/shared/utils/format_utils.dart';
import 'package:fa_prev/shared/widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:google_fonts/google_fonts.dart';

import 'package:fa_prev/modules/cart/cart.dart';

// Represents one row (one sandwich) in cart page
class CartListItemWidget extends StatefulWidget {
  final GeoUnit unit;
  final OrderItem order;
  CartListItemWidget({Key key, this.unit, this.order}) : super(key: key);

  @override
  _CartListItemWidgetState createState() => _CartListItemWidgetState();
}

class _CartListItemWidgetState extends State<CartListItemWidget> {
  Widget build(BuildContext context) {
    return Container(
      height: 110,
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Align(
            alignment: Alignment.topLeft,
            child: Container(
              padding: EdgeInsets.only(
                top: 8,
                left: 0,
                right: 12,
              ),
              width: 100,
              child: ImageWidget(
                url: this.widget.order.image,
                placeholder: CircularProgressIndicator(),
                errorWidget: Icon(Icons.error),
                fit: BoxFit.cover,
              ),
            ),
          ),
          Expanded(
            flex: 1,
            child: Stack(
              // fit: StackFit.passthrough,
              children: <Widget>[
                Positioned(
                  top: 16,
                  left: 0,
                  child: Container(
                    margin: EdgeInsets.all(0.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          getLocalizedText(context, widget.order.productName).toUpperCase(),
                          textAlign: TextAlign.left,
                          style: GoogleFonts.poppins(
                            color: theme.text,
                            fontWeight: FontWeight.bold,
                            fontSize: 14,
                          ),
                        ),
                        Text(
                          "x${widget.order.quantity}  -  ${getLocalizedText(context, widget.order.variantName)}",
                          textAlign: TextAlign.left,
                          style: GoogleFonts.poppins(
                            color: theme.text,
                            fontWeight: FontWeight.normal,
                            fontSize: 14,
                          ),
                        ),
                        SizedBox(
                          height: 16,
                        ),
                        Container(
                          margin: EdgeInsets.only(bottom: 2),
                          child: Text(
                            formatCurrency(getTotalPriceOfOrederItem(widget.order),
                                widget.unit.currency ?? 'huf'), // TODO geounit!!
                            textAlign: TextAlign.left,
                            style: GoogleFonts.poppins(
                              color: theme.highlight,
                              fontSize: 16,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                Positioned(
                  right: 8,
                  bottom: 8,
                  child: Container(
                    height: 42,
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        Container(
                          width: 40,
                          height: 40,
                          child: TextButton(
                            style: TextButton.styleFrom(
                              padding: EdgeInsets.all(0),
                              shape: CircleBorder(
                                side: BorderSide(
                                  color: theme.border2.withOpacity(0.4),
                                ),
                              ),
                              backgroundColor: Colors.transparent,
                              primary: theme.text,
                            ),
                            onPressed: () => _removeOrder(),
                            child: Text(
                              '-',
                              textAlign: TextAlign.center,
                              style: GoogleFonts.poppins(
                                color: theme.text,
                                fontSize: 26,
                              ),
                            ),
                          ),
                        ),
                        SizedBox(
                          width: 12,
                        ),
                        Container(
                          width: 40,
                          height: 40,
                          child: TextButton(
                            style: TextButton.styleFrom(
                              padding: EdgeInsets.all(0),
                              shape: CircleBorder(
                                side: BorderSide(
                                  color: theme.border2.withOpacity(0.4),
                                ),
                              ),
                              backgroundColor: Colors.transparent,
                              primary: theme.text,
                            ),
                            onPressed: () => _addOrder(),
                            child: Text(
                              '+',
                              textAlign: TextAlign.center,
                              style: GoogleFonts.poppins(
                                color: theme.text,
                                fontSize: 26,
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  void _addOrder() {
    BlocProvider.of<CartBloc>(context).add(AddProductToCartAction(widget.unit, widget.order));
  }

  void _removeOrder() {
    BlocProvider.of<CartBloc>(context)
        .add(RemoveProductFromCartAction(widget.unit.chainId, widget.unit.id, widget.order));
  }

  double getTotalPriceOfOrederItem(OrderItem item) {
    return item.quantity * item.priceShown.pricePerUnit;
    //return item.quantity * item...price;
  }
}
