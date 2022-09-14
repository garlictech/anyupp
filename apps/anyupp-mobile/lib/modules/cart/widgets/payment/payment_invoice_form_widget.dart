import '/core/core.dart';
import '/core/theme/theme.dart';
import '/models.dart';
import '/modules/cart/cart.dart';
import '/shared/locale.dart';
import '/shared/widgets.dart';
import 'package:flutter/material.dart';

class PaymentInvoiceFormWidget extends StatelessWidget {
  final PaymentMethodExt? selectedPaymentMethod;
  final bool wantsInVoice;
  final UserInvoiceAddress? address;
  final ValueChanged<UserInvoiceAddress?> onAddressChanged;
  final ValueChanged<bool> onWantInvoiceChanged;

  const PaymentInvoiceFormWidget({
    Key? key,
    this.address,
    required this.onAddressChanged,
    this.selectedPaymentMethod,
    required this.wantsInVoice,
    required this.onWantInvoiceChanged,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(
        left: 16,
        top: 16,
        bottom: 16,
        right: 12,
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.start,
        children: [
          BorderedWidget(
            child: Padding(
              padding: const EdgeInsets.all(6.0),
              child: Icon(
                Icons.receipt_long_outlined,
                color: theme.secondary,
                size: 20,
              ),
            ),
          ),
          SizedBox(width: 16.0),
          address == null
              ? Expanded(
                  child: Text(
                    trans(
                        context, 'payment.paymentInfo.invoicing.want_invoice'),
                    style: Fonts.satoshi(
                      fontSize: 16,
                      color: theme.secondary,
                      fontWeight: FontWeight.w400,
                    ),
                    textAlign: TextAlign.left,
                  ),
                )
              : Expanded(
                  child: InkWell(
                    onTap: () async {
                      var newAddress = await showInvoiceFormBottomSheet(
                          context,
                          address,
                          getPaymentModeFromSelection(selectedPaymentMethod));
                      if (newAddress != null) {
                        onAddressChanged(newAddress);
                      }
                    },
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          '${address!.customerName}, ${address!.postalCode}, ${address!.city}, ${address!.streetAddress}',
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          // softWrap: true,
                          style: Fonts.satoshi(
                            fontSize: 16.0,
                            color: theme.secondary,
                          ),
                        ),
                        Text(
                          trans(
                            context,
                            'payment.paymentInfo.invoicing.modifyAddress',
                          ),
                          style: Fonts.satoshi(
                            fontSize: 12.0,
                            color: theme.secondary40,
                          ),
                        )
                      ],
                    ),
                  ),
                ),
          Transform.scale(
            scale: 1.5,
            child: Checkbox(
              shape: CircleBorder(
                  side: BorderSide(
                color: theme.highlight,
                style: BorderStyle.solid,
              )),
              activeColor: theme.highlight,
              fillColor: MaterialStateColor.resolveWith((states) {
                if (states.isEmpty) {
                  return theme.secondary16;
                }
                var state = states.first;
                switch (state) {
                  case MaterialState.selected:
                    return theme.highlight;
                  default:
                    return theme.secondary;
                }
              }),
              value: wantsInVoice,
              onChanged: (selected) async {
                if (address == null) {
                  UserInvoiceAddress? newAddress =
                      await showInvoiceFormBottomSheet(context, null,
                          getPaymentModeFromSelection(selectedPaymentMethod));
                  if (newAddress != null) {
                    onAddressChanged(newAddress);
                  }
                  onWantInvoiceChanged(newAddress != null && !wantsInVoice);
                } else {
                  onWantInvoiceChanged(!wantsInVoice);
                }
              },
            ),
          ),
        ],
      ),
    );
  }
}
