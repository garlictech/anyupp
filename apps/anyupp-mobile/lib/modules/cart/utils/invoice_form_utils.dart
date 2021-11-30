import 'package:flutter/material.dart';
import 'package:form_field_validator/form_field_validator.dart';

FieldValidator emailValidator(BuildContext context) => MultiValidator([
      EmailValidator(errorText: ''),
      RequiredValidator(errorText: ''),
    ]);
FieldValidator emailOrPhoneValidator(BuildContext context) => MultiValidator([
      RequiredValidator(errorText: ''),
    ]);

FieldValidator requiredValidator(BuildContext context) => MultiValidator([
      RequiredValidator(errorText: ''),
    ]);
