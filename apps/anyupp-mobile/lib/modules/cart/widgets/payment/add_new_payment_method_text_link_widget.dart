import '/core/core.dart';
import '/modules/cart/cart.dart';
import '/shared/locale/locale.dart';
import 'package:flutter/material.dart';

class AddNewPaymentMethodTextLinkWidget extends StatelessWidget {
  const AddNewPaymentMethodTextLinkWidget({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: () {
        showAddPaymentMethodBottomSheet(context);
      },
      child: Padding(
        padding: const EdgeInsets.only(
          top: 16.0,
          left: 16.0,
          bottom: 24.0,
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              trans(context, 'payment.method.addNewCard'),
              style: Fonts.hH5(
                color: theme.highlight,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
