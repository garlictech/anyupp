import 'package:country_code_picker/country_code_picker.dart';
import '/core/core.dart';
import '/modules/cart/cart.dart';
import 'package:flutter/material.dart';

Widget customCountryPickerWidget(
  ThemeChainData theme,
  BuildContext context,
  String labelKey,
  TextEditingController nameController,
  TextEditingController codeController,
) {
  String initialValue = codeController.text;
  return Container(
    decoration: BoxDecoration(
      borderRadius: BorderRadius.circular(0.0),
      border: Border.all(
        width: 1,
        color: theme.secondary16,
      ),
    ),
    child: Padding(
      padding: const EdgeInsets.only(
        top: 7.0,
        bottom: 7.0,
        left: 16.0,
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            labelKey,
            style: Fonts.satoshi(
              fontSize: 16.0,
              fontWeight: FontWeight.w400,
              color: theme.secondary40,
            ),
          ),
          CountryCodePicker(
            // barrierColor: theme.secondary,
            closeIcon: Icon(
              Icons.close,
              color: theme.secondary,
            ),
            textStyle: Fonts.satoshi(
              fontSize: 16.0,
              fontWeight: FontWeight.w400,
              color: theme.secondary,
            ),
            dialogTextStyle: Fonts.satoshi(
              fontSize: 16.0,
              fontWeight: FontWeight.w400,
              color: theme.secondary,
            ),
            // boxDecoration: BoxDecoration(
            //   color: theme.secondary0,
            //   borderRadius: BorderRadius.only(
            //     topLeft: Radius.circular(16.0),
            //     topRight: Radius.circular(16.0),
            //   ),
            // ),
            searchStyle: Fonts.satoshi(
              fontSize: 16.0,
              fontWeight: FontWeight.w400,
              color: theme.secondary,
            ),
            searchDecoration: buildTextFieldDecoration(
              border: BorderRadius.only(
                topRight: Radius.circular(0.0),
                bottomRight: Radius.circular(0.0),
                topLeft: Radius.circular(0.0),
                bottomLeft: Radius.circular(0.0),
              ),
            ),
            // searchDecoration: createFormFieldDecoration(
            //   labelText: labelKey,
            //   hintText: '',
            //   theme: theme,
            //   border: OutlineInputBorder(
            //     borderRadius: BorderRadius.circular(12.0),
            //     borderSide: BorderSide(
            //       color: theme.secondary64,
            //       width: 1.0,
            //     ),
            //   ),
            // ),
            // searchDecoration: InputDecoration(
            //   alignLabelWithHint: true,
            //   contentPadding: const EdgeInsets.only(
            //     left: 16.0,
            //     right: 16.0,
            //     top: 8.0,
            //     bottom: 8.0,
            //   ),
            //   focusColor: theme.secondary,
            //   focusedBorder: OutlineInputBorder(
            //     borderRadius: BorderRadius.circular(12.0),
            //     borderSide: BorderSide(
            //       color: theme.secondary64,
            //       width: 1.0,
            //     ),
            //   ),
            //   border: OutlineInputBorder(
            //     borderRadius: BorderRadius.circular(12.0),
            //     borderSide: BorderSide(
            //       color: theme.secondary64,
            //       width: 1.0,
            //     ),
            //   ),
            //   labelText: labelKey,
            //   labelStyle: Fonts.satoshi(
            //     fontSize: 16.0,
            //     fontWeight: FontWeight.w400,
            //     color: theme.secondary40,
            //   ),
            // ),
            padding: EdgeInsets.all(0.0),
            onInit: (CountryCode? code) => nameController.text = code?.name ?? '',
            //alignLeft: true,

            onChanged: (CountryCode countryCode) {
              codeController.text = countryCode.code ?? '';
              nameController.text = countryCode.name ?? '';
            },
            showDropDownButton: true,
            // Initial selection and favorite can be one of code ('IT') OR dial_code('+39')
            initialSelection: initialValue,
            // optional. Shows only country name and flag
            showCountryOnly: true,
            // optional. Shows only country name and flag when popup is closed.
            showOnlyCountryWhenClosed: true,

            // optional. aligns the flag and the Text left
            //alignLeft: false,
          ),
        ],
      ),
    ),
  );
}
