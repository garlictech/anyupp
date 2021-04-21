import 'package:fa_prev/shared/locale/extensions/locale_extension.dart';
import 'package:flutter/material.dart';
import 'package:form_field_validator/form_field_validator.dart';
import 'package:google_fonts/google_fonts.dart';

class LoginFormUtils {
  static const double TEXTFIELD_HEIGHT = 60.0;

  static Widget buildTextField(
    BuildContext context,
    String labelKey,
    TextEditingController controller,
    TextInputType inputType,
    bool isPassword,
    FieldValidator validator,
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
        cursorColor: Color(0xFF3C2F2F),
        style: GoogleFonts.poppins(
          fontSize: 16.0,
          fontWeight: FontWeight.w400,
          color: Color(0xFF3C2F2F),
        ),
        decoration: InputDecoration(
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
          // helperText: 'You will receive an email with the login link...',
          // helperStyle: GoogleFonts.poppins(
          //   fontSize: 13.0,
          //   fontWeight: FontWeight.w400,
          //   color: Color(0xFF3C2F2F).withOpacity(0.5),
          // ),
        ),
      ),
    );
  }

  static FieldValidator emailOrPhoneValidator(BuildContext context) =>
      MultiValidator([
        RequiredValidator(
            errorText: transEx(context, 'this field is required')),
      ]);

  static FieldValidator emailValidator(BuildContext context) => MultiValidator([
        EmailValidator(
            errorText: transEx(context, 'enter a valid email address')),
        RequiredValidator(
            errorText: transEx(context, 'this field is required')),
      ]);

  static FieldValidator passwordValidator(BuildContext context) =>
      MultiValidator([
        RequiredValidator(errorText: 'password is required'),
        MinLengthValidator(8,
            errorText: 'password must be at least 8 digits long'),
        PatternValidator(r'(?=.*?[#?!@$%^&*-])',
            errorText: 'passwords must have at least one special character'),
      ]);
}
