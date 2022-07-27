import '/shared/locale/extensions/locale_extension.dart';
import 'package:flutter/material.dart';
import 'package:form_field_validator/form_field_validator.dart';
import '/core/theme/theme.dart';

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
        style: Fonts.satoshi(
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
          labelStyle: Fonts.satoshi(
            fontSize: 16.0,
            fontWeight: FontWeight.w400,
            color: Color(0xFF3C2F2F),
          ),
          // helperText: 'You will receive an email with the login link...',
          // helperStyle: Fonts.satoshi(
          //   fontSize: 13.0,
          //   fontWeight: FontWeight.w400,
          //   color: Color(0xFF3C2F2F).withOpacity(0.5),
          // ),
        ),
      ),
    );
  }

  static FieldValidator emailOrPhoneValidator(BuildContext context) => MultiValidator([
        RequiredValidator(errorText: transEx(context, 'validators.required')),
      ]);

  static FieldValidator confirmCodeValidator(BuildContext context) => MultiValidator([
        RequiredValidator(errorText: transEx(context, 'validators.required')),
      ]);

  static FieldValidator emailValidator(BuildContext context) => MultiValidator([
        EmailValidator(errorText: transEx(context, 'validators.enterValidEmail')),
        RequiredValidator(errorText: transEx(context, transEx(context, 'validators.required'))),
      ]);

  static FieldValidator passwordValidator(BuildContext context) => MultiValidator([
        RequiredValidator(errorText: transEx(context, 'validators.passwordIsRequired')),
        MinLengthValidator(8, errorText: transEx(context, 'validators.passwordLengthError')),
        PatternValidator(r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$',
            errorText: transEx(context, 'validators.passwordValidatorText')),
      ]);

  static FieldValidator phoneValidator(BuildContext context) => MultiValidator(
      [PatternValidator(r'^\+(?:[0-9]●?){6,14}[0-9]$', errorText: transEx(context, 'validators.eneterValidPhone'))]);
}
