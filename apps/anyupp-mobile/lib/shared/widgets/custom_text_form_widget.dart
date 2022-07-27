import '/core/core.dart';
import '/shared/utils/form_style_utils.dart';
import 'package:flutter/material.dart';

Widget customTextFormWidget(
  BuildContext context,
  ThemeChainData theme,
  String labelKey,
  TextEditingController controller,
  TextInputType inputType,
  bool isPassword,
  FormFieldValidator<String>? validator,
) {
  return Container(
    // height: TEXTFIELD_HEIGHT,
    padding: EdgeInsets.only(top: 5.0, bottom: 5.0),
    child: TextFormField(
      controller: controller,
      validator: validator,
      // autofocus: true,
      obscureText: isPassword,
      enableSuggestions: !isPassword,
      autocorrect: !isPassword,
      keyboardType: inputType,
      textInputAction: TextInputAction.next,
      // cursorColor: Color(0xFF3C2F2F),
      style: Fonts.satoshi(
        fontSize: 16.0,
        fontWeight: FontWeight.w400,
        color: theme.secondary,
      ),
      decoration: createFormFieldDecoration(
        theme: theme,
        labelText: labelKey,
        hintText: '',
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12.0),
          borderSide: BorderSide(
            color: theme.secondary64,
            width: 1.0,
          ),
        ),
      ),
      // decoration: InputDecoration(
      //   alignLabelWithHint: true,
      //   contentPadding: const EdgeInsets.only(
      //     left: 16.0,
      //     right: 16.0,
      //     top: 8.0,
      //     bottom: 8.0,
      //   ),
      //   focusColor: Color(0xffe7e5d0),
      //   focusedBorder: OutlineInputBorder(
      //     borderRadius: BorderRadius.circular(12.0),
      //     borderSide: BorderSide(
      //       color: Color(0xffe7e5d0),
      //       width: 1.0,
      //     ),
      //   ),
      //   border: OutlineInputBorder(
      //     borderRadius: BorderRadius.circular(12.0),
      //     borderSide: BorderSide(
      //       color: Color(0xffe7e5d0),
      //       width: 1.0,
      //     ),
      //   ),
      //   labelText: labelKey,
      //   labelStyle: Fonts.satoshi(
      //     fontSize: 16.0,
      //     fontWeight: FontWeight.w400,
      //     color: Color(0xFF3C2F2F),
      //   ),
      //   // helperText: 'You will receive an email with the login link...',
      //   // helperStyle: Fonts.satoshi(
      //   //   fontSize: 13.0,
      //   //   fontWeight: FontWeight.w400,
      //   //   color: Color(0xFF3C2F2F).withOpacity(0.5),
      //   // ),
      // ),
    ),
  );
}
