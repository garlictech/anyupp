import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/modules/cart/cart.dart';
import 'package:flutter/material.dart';
import 'package:mask_text_input_formatter/mask_text_input_formatter.dart';
import 'package:fa_prev/shared/locale.dart';

class FormTextFieldWidget extends StatelessWidget {
  final String labelKey;
  final FocusNode? focusNode;
  final TextEditingController controller;
  final BorderRadius border;
  final bool autofocus;
  final TextInputType? keyboardType;
  final MaskTextInputFormatter? mask;
  final IconData? icon;
  final ValueChanged<String>? onChanged;
  final FormFieldValidator<String>? validator;
  final FormFieldSetter<String>? onSaved;
  const FormTextFieldWidget({
    Key? key,
    required this.labelKey,
    required this.controller,
    this.focusNode,
    this.keyboardType = TextInputType.text,
    this.border = const BorderRadius.all(Radius.zero),
    this.mask,
    this.icon,
    this.autofocus = false,
    this.onChanged,
    this.validator,
    this.onSaved,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      focusNode: focusNode,
      controller: controller,
      autofocus: autofocus,
      style: Fonts.satoshi(
        fontSize: 16.0,
        fontWeight: FontWeight.w400,
        color: theme.secondary,
      ),
      inputFormatters: mask != null ? [mask!] : null,
      onChanged: onChanged,
      decoration: buildTextFieldDecoration(
        label: trans(context, labelKey),
        prefixIcon: icon != null
            ? Icon(
                icon,
                color: focusNode == null
                    ? null
                    : focusNode!.hasFocus
                        ? theme.secondary
                        : theme.secondary40,
              )
            : null,
        border: border,
      ),
      onSaved: onSaved,
      validator: validator,
      keyboardType: keyboardType,
    );
  }
}
