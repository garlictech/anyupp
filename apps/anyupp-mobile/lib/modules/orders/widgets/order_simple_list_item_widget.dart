import '/core/theme/theme.dart';
import '/models.dart';
import '/shared/locale.dart';
import '/shared/utils/format_utils.dart';
import 'package:flutter/material.dart';

class OrderSimpleListItemWidget extends StatelessWidget {
  final OrderItem orderItem;

  const OrderSimpleListItemWidget({
    required this.orderItem,
  });

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
                  style: Fonts.satoshi(
                    fontSize: 14,
                    color: theme.secondary,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                Text(
                  '${getLocalizedText(context, orderItem.variantName)} x ${orderItem.quantity}',
                  style: Fonts.satoshi(
                    fontSize: 14,
                    color: theme.secondary,
                  ),
                ),
                ...getExtraNames(context)
              ],
            ),
          ),
          Text(
            formatCurrency(orderItem.sumPriceShown.priceSum, orderItem.priceShown.currency),
            style: Fonts.satoshi(
              fontSize: 14,
              color: theme.secondary,
            ),
          ),
        ],
      ),
    );
  }

  List<Widget> getExtraNames(BuildContext context) {
    List<Widget> children = [];
    if (orderItem.selectedConfigMap != null) {
      orderItem.selectedConfigMap!.forEach((key, value) {
        for (ProductConfigComponent generatedProductConfigComponent in value) {
          children.add(Text(
            getLocalizedText(context, generatedProductConfigComponent.name),
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
}
