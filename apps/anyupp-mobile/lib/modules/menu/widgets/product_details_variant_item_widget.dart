import 'package:fa_prev/core/theme/theme.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class ProductDetailVariantItemWidget extends StatefulWidget {
  final GeoUnit unit;
  final Cart cart;
  final GeneratedProduct product;
  final ProductVariant variant;
  final Widget child;

  const ProductDetailVariantItemWidget({Key key, this.unit, this.cart, this.product, this.variant, this.child})
      : super(key: key);
  @override
  _ProductDetailVariantItemWidgetState createState() => _ProductDetailVariantItemWidgetState();
}

class _ProductDetailVariantItemWidgetState extends State<ProductDetailVariantItemWidget> {
  @override
  Widget build(BuildContext context) {
    return Container(
      //height: 76,
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
      child: Column(
        children: [
          Row(
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
              widget.child
            ],
          ),
        ],
      ),
    );
  }
}

