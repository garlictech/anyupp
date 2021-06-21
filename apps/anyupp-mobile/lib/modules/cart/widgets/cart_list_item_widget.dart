import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/core/theme/theme.dart';
import 'package:fa_prev/modules/menu/widgets/allergens_widget.dart';
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
      //  height: 110,
      child: Row(
        // crossAxisAlignment: CrossAxisAlignment.stretch,
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
              child: ImageWidget(
                url: this.widget.order.image,
                placeholder: CircularProgressIndicator(),
                errorWidget: Icon(Icons.error),
                fit: BoxFit.cover,
              ),
            ),
          ),
          Expanded(
            flex: 3,
            child: Column(
              // fit: StackFit.passthrough,
              children: <Widget>[
                Container(
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
                      ...getExtraNames(context),
                     // getOrderItemAllergenWidget(),
                      SizedBox(
                        height: 16,
                      ),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.end,
                        children: [
                          Container(
                            margin: EdgeInsets.only(bottom: 2),
                            child: Text(
                              formatCurrency(getTotalPriceOfOrederItem(widget.order),
                                  widget.unit.currency ?? 'ft'), 
                              textAlign: TextAlign.left,
                              style: GoogleFonts.poppins(
                                color: theme.highlight,
                                fontSize: 16,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ),
                          Spacer(),
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
                            width: 16,
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
                          )
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

  List<Widget> getExtraNames(BuildContext context) {
    List<Widget> children = [];
    if (widget.order.selectedConfigMap != null) {
      widget.order.selectedConfigMap.forEach((key, value) {
        for (GeneratedProductConfigComponent generatedProductConfigComponent in value) {
          children.add(Text(
            getLocalizedText(context, generatedProductConfigComponent.name), 
            textAlign: TextAlign.left,
            style: GoogleFonts.poppins(
              color: theme.text,
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

  Widget getOrderItemAllergenWidget() {
    List<String> allergens = widget.order.allergens;
    if (widget.order.selectedConfigMap != null) {
      widget.order.selectedConfigMap.forEach((key, value) {
        for (GeneratedProductConfigComponent generatedProductConfigComponent in value) {
          for (Allergen allergen in generatedProductConfigComponent.allergens) {
            String temp = allergen.toString().split(".").last;
            if (!allergens.contains(temp)) {
              allergens.add(temp);
            }
          }
        }
      });
    }

    return AllergensWidget(
      allergens: allergens,
    );
  }

  void _addOrder() {
    BlocProvider.of<CartBloc>(context).add(AddProductToCartAction(widget.unit, widget.order));
  }

  void _removeOrder() {
    BlocProvider.of<CartBloc>(context)
        .add(RemoveProductFromCartAction(widget.unit.id, widget.order));
  }

  double getTotalPriceOfOrederItem(OrderItem item) {
    return item.quantity * item.getPrice();
    //return item.quantity * item...price;
  }
}
