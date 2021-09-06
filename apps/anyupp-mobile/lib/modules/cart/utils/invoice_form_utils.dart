import 'package:fa_prev/shared/locale/extensions/locale_extension.dart';
import 'package:flutter/material.dart';
import 'package:form_field_validator/form_field_validator.dart';

FieldValidator emailValidator(BuildContext context) => MultiValidator([
      EmailValidator(errorText: transEx(context, 'enter_valid_email')),
      RequiredValidator(errorText: transEx(context, 'validators.required')),
    ]);
FieldValidator emailOrPhoneValidator(BuildContext context) => MultiValidator([
      RequiredValidator(errorText: transEx(context, 'validators.required')),
    ]);

FieldValidator requiredValidator(BuildContext context) => MultiValidator([
      RequiredValidator(errorText: transEx(context, 'validators.required')),
    ]);
