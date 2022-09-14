import '/core/theme/theme.dart';
import '/modules/cart/cart.dart';
import '/shared/locale.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

class PaymentMethodListItemWidget extends StatelessWidget {
  final String icon;
  final String titleKey;
  final String? descriptionKey;
  final PaymentMethodExt value;
  final PaymentMethodExt? selected;
  final ValueChanged<PaymentMethodExt?>? onChanged;

  const PaymentMethodListItemWidget({
    Key? key,
    required this.icon,
    required this.titleKey,
    required this.value,
    this.descriptionKey,
    this.selected,
    this.onChanged,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: () => onChanged != null ? onChanged!(value) : null,
      child: Container(
        margin: const EdgeInsets.only(
          top: 8.0,
          left: 16.0,
        ),
        child: Column(
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.start,
              children: [
                Padding(
                  padding: EdgeInsets.zero,
                  child: Container(
                    width: 44,
                    height: 32,
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(4.0),
                      color: theme.secondary12,
                    ),
                    padding: EdgeInsets.symmetric(
                      horizontal: 7.0,
                      vertical: 4.0,
                    ),
                    margin: EdgeInsets.only(
                      right: 16.0,
                    ),
                    child: SvgPicture.asset(
                      icon,
                      color: theme.secondary,
                      // height: 73.0,
                      // width: 48.0,
                      // fit: BoxFit.fitWidth,
                    ),
                  ),
                ),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        trans(context, titleKey),
                        style: Fonts.satoshi(
                          fontSize: 16.0,
                          fontWeight: FontWeight.w600,
                          color: theme.secondary,
                        ),
                      ),
                      if (descriptionKey != null)
                        Text(
                          trans(context, descriptionKey!),
                          style: Fonts.satoshi(
                            fontSize: 12.0,
                            fontWeight: FontWeight.w400,
                            color: theme.secondary40,
                          ),
                        ),
                    ],
                  ),
                ),
                Theme(
                  data: Theme.of(context).copyWith(
                    unselectedWidgetColor:
                        theme.secondary16, // Radio disabled color
                  ),
                  child: Container(
                    padding: EdgeInsets.only(
                      right: 10.0,
                    ),
                    child: Transform.scale(
                      scale: 1.5,
                      child: Radio<PaymentMethodExt>(
                        value: value,
                        groupValue: selected,
                        onChanged: onChanged,
                        activeColor: theme.highlight, // Radio selected color
                      ),
                    ),
                  ),
                ),
              ],
            ),
            SizedBox(
              height: 8.0,
            ),
            Padding(
              padding: const EdgeInsets.only(right: 24.0),
              child: Divider(
                color: theme.secondary16,
                height: 1,
              ),
            ),
            // if (isSelected && info != null) ...[info, SizedBox(height: 14.0)]
          ],
        ),
      ),
    );
  }
}
