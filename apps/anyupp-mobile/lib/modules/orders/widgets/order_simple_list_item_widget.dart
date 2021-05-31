import 'package:fa_prev/core/theme/theme.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/shared/utils/format_utils.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class OrderSimpleListItemWidget extends StatelessWidget {
  final OrderItem orderItem;

  const OrderSimpleListItemWidget({
    Key key,
    this.orderItem,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(
        top: 20.0,
        bottom: 20.0,
        left: 20.0,
        right: 20.0,
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  getLocalizedText(context, orderItem.productName),
                  style: GoogleFonts.poppins(
                    fontSize: 14,
                    color: theme.text,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                Text(
                  '${getLocalizedText(context, orderItem.variantName)} x ${orderItem.quantity}',
                  style: GoogleFonts.poppins(
                    fontSize: 14,
                    color: theme.text,
                  ),
                ),
                ...getExtraNames(context)
              ],
            ),
          ),
          Text(
            formatCurrency(orderItem.getPrice(), orderItem.priceShown.currency ?? 'huf'), // TODO geounit!!
            style: GoogleFonts.poppins(
              fontSize: 14,
              color: theme.text,
            ),
          ),
        ],
      ),
    );
  }
  List<Widget> getExtraNames(BuildContext context) {
    List<Widget> children = [];
    if (orderItem.selectedConfigMap != null) {
      orderItem.selectedConfigMap.forEach((key, value) {
        for (GeneratedProductConfigComponent generatedProductConfigComponent in value) {
          children.add(Text(
            getLocalizedText(context, generatedProductConfigComponent.name), // TODO geounit!!
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
}
