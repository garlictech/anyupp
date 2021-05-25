import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/menu/menu.dart';
import 'package:fa_prev/shared/nav.dart';
import 'package:fa_prev/shared/utils/format_utils.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:fa_prev/core/theme/theme.dart';
import 'package:fa_prev/modules/cart/cart.dart';
import 'package:fa_prev/shared/locale.dart';

class ProductDetailVariantItemWidget extends StatefulWidget {
  final GeoUnit unit;
  final Cart cart;
  final GeneratedProduct product;
  final ProductVariant variant;

  const ProductDetailVariantItemWidget({Key key, this.unit, this.cart, this.product, this.variant}) : super(key: key);
  @override
  _ProductDetailVariantItemWidgetState createState() => _ProductDetailVariantItemWidgetState();
}

class _ProductDetailVariantItemWidgetState extends State<ProductDetailVariantItemWidget> {
  @override
  Widget build(BuildContext context) {
    final int variantCountInCart = widget.cart == null ? 0 : widget.cart.variantCount(widget.product, widget.variant);

    return Container(
      height: 76,
      margin: EdgeInsets.only(left: 14, top: 10, right: 14),
      decoration: BoxDecoration(
        color: theme.background2,
        boxShadow: [
          BoxShadow(
            color: Color.fromARGB(5, 0, 0, 0),
            offset: Offset(0, 0),
            blurRadius: 20,
          ),
        ],
        borderRadius: BorderRadius.all(
          Radius.circular(12),
        ),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Expanded(
//            flex: 65,
            child: Container(
              margin: EdgeInsets.only(left: 22, top: 5, bottom: 5, right: 8),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    getLocalizedText(context, widget.variant.variantName),
                    textAlign: TextAlign.left,
                    overflow: TextOverflow.ellipsis,
                    maxLines: 1,
                    style: GoogleFonts.poppins(
                      color: theme.text,
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                    ),
                  ),
                  if (widget.variant.pack.size > 0.0)
                    Container(
                      margin: EdgeInsets.only(top: 4),
                      child: Text(
                        '${widget.variant.pack.size} ${widget.variant.pack.unit}',
                        textAlign: TextAlign.left,
                        style: GoogleFonts.poppins(
                          color: theme.highlight,
                          fontWeight: FontWeight.w500,
                          fontSize: 12,
                        ),
                      ),
                    ),
                ],
              ),
            ),
          ),
          Align(
            alignment: Alignment.centerRight,
            // flex: 35,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.start,
              children: [
                Container(
                  margin: EdgeInsets.only(right: 8.0),
                  child: Text(
                    formatCurrency(widget.variant.price, widget.unit.currency ?? 'huf'), // TODO geounit!!
                    textAlign: TextAlign.right,
                    style: GoogleFonts.poppins(
                      color: theme.highlight,
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
                Container(
                  width: 46,
                  height: 46,
                  margin: EdgeInsets.only(right: 15),
                  child: TextButton(
                    style: TextButton.styleFrom(
                      padding: EdgeInsets.all(0),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(10.0),
                      ),
                      backgroundColor: theme.indicator,
                      primary: theme.text2,
                    ),
                    onPressed: () {
                      // _addOrder(variant); // TODO
                      Nav.to(ProductConfiguratorScreen(
                        cart: widget.cart,
                        product: widget.product,
                        variant: widget.variant,
                        unit: widget.unit,
                      ),
                      //duration: Duration(milliseconds: 100),
                      //animationType: NavAnim.SLIDEIN_DOWN,
                      );
                    },
                    child: AnimatedSwitcher(
                      duration: const Duration(milliseconds: 300),
                      transitionBuilder: (Widget child, Animation<double> animation) {
                        return ScaleTransition(
                          child: child,
                          scale: animation,
                        );
                      },
                      child: Text(
                        variantCountInCart == 0 ? '+' : 'x$variantCountInCart',
                        key: ValueKey<String>('${widget.variant.id}-$variantCountInCart'),
                        softWrap: false,
                        textAlign: TextAlign.center,
                        style: GoogleFonts.poppins(
                          color: theme.text2,
                          fontSize: variantCountInCart == 0 ? 32.0 : 24.0,
                          fontWeight: FontWeight.w400,
                        ),
                      ),
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
  
}
