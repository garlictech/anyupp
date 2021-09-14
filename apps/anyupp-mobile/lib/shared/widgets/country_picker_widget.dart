import 'package:country_code_picker/country_code_picker.dart';
import 'package:fa_prev/core/core.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

Widget customCountryPickerWidget(
  ThemeChainData theme,
  BuildContext context,
  String labelKey,
  TextEditingController nameController,
  TextEditingController codeController,
) {
  String initialValue = codeController.text;
  return Padding(
    padding: EdgeInsets.only(top: 5.0, bottom: 5.0),
    child: Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(12.0),
        border: Border.all(
          width: 1,
          color: Colors.grey,
        ),
      ),
      child: Padding(
        padding: const EdgeInsets.only(left: 16.0),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              labelKey,
              style: GoogleFonts.poppins(
                fontSize: 16.0,
                fontWeight: FontWeight.w400,
                color: Color(0xFF3C2F2F),
              ),
            ),
            CountryCodePicker(
              textStyle: GoogleFonts.poppins(
                fontSize: 16.0,
                fontWeight: FontWeight.w400,
                color: Color(0xFF3C2F2F),
              ),
              dialogTextStyle: GoogleFonts.poppins(
                fontSize: 16.0,
                fontWeight: FontWeight.w400,
                color: Color(0xFF3C2F2F),
              ),
              boxDecoration: BoxDecoration(
                color: theme.background,
                borderRadius: BorderRadius.only(
                  topLeft: Radius.circular(16.0),
                  topRight: Radius.circular(16.0),
                ),
              ),
              searchDecoration: InputDecoration(
                alignLabelWithHint: true,
                contentPadding: const EdgeInsets.only(
                  left: 16.0,
                  right: 16.0,
                  top: 8.0,
                  bottom: 8.0,
                ),
                focusColor: Color(0xffe7e5d0),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12.0),
                  borderSide: BorderSide(
                    color: Color(0xffe7e5d0),
                    width: 1.0,
                  ),
                ),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12.0),
                  borderSide: BorderSide(
                    color: Color(0xffe7e5d0),
                    width: 1.0,
                  ),
                ),
                labelText: labelKey,
                labelStyle: GoogleFonts.poppins(
                  fontSize: 16.0,
                  fontWeight: FontWeight.w400,
                  color: Color(0xFF3C2F2F),
                ),
              ),
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
    ),
  );
}
