import 'package:flutter/material.dart';
import '/core/theme/theme.dart';
import '/shared/locale.dart';

class PaymentErrorWidget extends StatelessWidget {
  final String messageKey;
  final GestureTapCallback? onTap;

  const PaymentErrorWidget({Key? key, required this.messageKey, this.onTap}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      // height: 64,
      decoration: BoxDecoration(
        color: theme.secondary,
        borderRadius: BorderRadius.all(
          Radius.circular(8.0),
        ),
      ),
      child: Row(
        children: [
          Expanded(
            child: Padding(
              padding: const EdgeInsets.only(
                left: 16.0,
                top: 12.0,
                bottom: 12.0,
              ),
              child: Text(
                trans(context, messageKey),
                maxLines: 3,
                style: Fonts.satoshi(
                  color: theme.secondary0,
                  fontSize: 14.0,
                ),
              ),
            ),
          ),
          InkWell(
            onTap: onTap,
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Text(
                trans(context, 'common.ok'),
                style: Fonts.satoshi(
                  color: theme.secondary0,
                  fontSize: 16.0,
                  // fontWeight: FontWeight.w700,+
                ),
              ),
            ),
          )
        ],
      ),
    );
  }
}
