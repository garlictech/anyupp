import 'dart:io';

import 'package:fa_prev/core/dependency_indjection/dependency_injection.dart';
import 'package:fa_prev/core/theme/theme.dart';
import 'package:fa_prev/core/units/units.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/cart/cart.dart';
import 'package:fa_prev/modules/cart/utils/invoice_form_utils.dart';
import 'package:fa_prev/modules/screens.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/shared/nav.dart';
import 'package:fa_prev/shared/user-details/user_details.dart';
import 'package:fa_prev/shared/widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

Future<UserInvoiceAddress?> showInvoiceFormBottomSheet(BuildContext context,
    UserInvoiceAddress? address, PaymentMode paymentMode) async {
  return showModalBottomSheet<UserInvoiceAddress?>(
    context: context,
    enableDrag: true,
    isScrollControlled: true,
    isDismissible: true,
    elevation: 4.0,
    backgroundColor: Colors.transparent,
    builder: (context) {
      return DraggableScrollableSheet(
          initialChildSize: 0.9, //set this as you want
          maxChildSize: 0.9, //set this as you want
          minChildSize: 0.5, //set this as you want
          expand: true,
          builder: (context, scrollController) {
            return InvoiceFormBottomSheetWidget(address, paymentMode);
          });
    },
  );
}

class InvoiceFormBottomSheetWidget extends StatefulWidget {
  final UserInvoiceAddress? address;
  final PaymentMode paymentMode;
  InvoiceFormBottomSheetWidget(this.address, this.paymentMode);
  @override
  _InvoiceFormBottomSheetWidgetState createState() =>
      _InvoiceFormBottomSheetWidgetState();
}

class _InvoiceFormBottomSheetWidgetState
    extends State<InvoiceFormBottomSheetWidget> {
  final profileFormKey = GlobalKey<FormState>();
  final _nameOrCompanyController = TextEditingController();
  final _emailController = TextEditingController();
  final _taxNumberController = TextEditingController();
  final _countryController = TextEditingController();
  final _countryCodeController = TextEditingController(text: 'HU');
  final _zipController = TextEditingController();
  final _cityController = TextEditingController();
  final _streetController = TextEditingController();
  FormFieldValidator<String>? taxFieldValidator;
  bool _showErrorMessage = false;

  @override
  void initState() {
    // getIt<UserDetailsBloc>().add(GetUserDetailsEvent());

    _countryCodeController.addListener(() {
      setState(() {
        profileFormKey.currentState?.reset();
      });
    });
    super.initState();
    if (widget.address != null) {
      _setTextFieldValue(
          _nameOrCompanyController, widget.address!.customerName);
      _setTextFieldValue(_cityController, widget.address!.city);
      _setTextFieldValue(_emailController, widget.address!.email ?? '');
      _setTextFieldValue(_zipController, widget.address!.postalCode);
      _setTextFieldValue(_streetController, widget.address!.streetAddress);
      _setTextFieldValue(_taxNumberController, widget.address!.taxNumber);
    }
  }

  @override
  void dispose() {
    getIt<UserDetailsBloc>().add(ResetUserDetailsEvent());
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return BlocListener<CartBloc, BaseCartState>(
      listener: (BuildContext context, BaseCartState state) {
        if (state is EmptyCartState) {
          // Navigate away in case of an empty cart. The cart gets deleted after the order has been created
          Nav.pop();
          Nav.replace(HomeScreen(pageIndex: 2));
        } else if (state is CartErrorState) {
          Nav.pop();
        }
      },
      child: BlocBuilder<UnitSelectBloc, UnitSelectState>(
        builder: (context, state) {
          if (state is UnitSelected) {
            // log.d('Unit selected=${state.unit}');
            return _buildInvoiceFormScreen(
              context,
              state.unit,
            );
          }

          return CenterLoadingWidget();
        },
      ),
    );
  }

  Widget _buildInvoiceFormScreen(
    BuildContext context,
    GeoUnit unit,
  ) {
    if (_countryCodeController.text != 'HU') {
      taxFieldValidator = null;
    } else {
      taxFieldValidator = requiredValidator(context);
    }
    return Container(
      // color: theme.secondary0,
      // margin: EdgeInsets.only(top: 64.0),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.only(
          topLeft: Radius.circular(16.0),
          topRight: Radius.circular(16.0),
        ),
        color: theme.secondary0,
      ),
      padding: EdgeInsets.only(
        top: 16.0,
        left: 16.0,
        right: 16.0,
        // bottom: 16.0,
        bottom: MediaQuery.of(context).viewInsets.bottom,
      ),
      child: SingleChildScrollView(
        physics: BouncingScrollPhysics(),
        child: Column(
          // mainAxisSize: MainAxisSize.min,
          // alignment: WrapAlignment.start,
          // direction: Axis.horizontal,
          // crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Column(
              mainAxisAlignment: MainAxisAlignment.start,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Center(
                  child: Container(
                    height: 4.0,
                    width: 40.0,
                    margin: const EdgeInsets.only(bottom: 16.0),
                    decoration: BoxDecoration(
                      color: theme.secondary16,
                      borderRadius: const BorderRadius.all(
                        Radius.circular(8.0),
                      ),
                    ),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.only(bottom: 24.0, top: 16.0),
                  child: Text(
                    trans('payment.paymentInfo.invoicing.invoice_info'),
                    style: Fonts.satoshi(
                      fontSize: 24,
                      color: theme.secondary,
                      fontWeight: FontWeight.w700,
                    ),
                    // textAlign: TextAlign.center,
                  ),
                ),
              ],
            ),
            _buildInvoiceForm(context),
            if (_showErrorMessage)
              Container(
                margin: EdgeInsets.only(top: 16.0),
                child: PaymentErrorWidget(
                  messageKey: 'payment.paymentInfo.invoicing.warning',
                  onTap: () => setState(() {
                    _showErrorMessage = false;
                  }),
                ),
              ),
            _buildSendCartButton(context, unit),
          ],
        ),
      ),
    );
  }

  Widget _buildInvoiceForm(BuildContext context) {
    // log.d('_buildInvoiceForm()=${_userProfile?.email}');

    return Form(
      key: profileFormKey,
      // autovalidateMode: AutovalidateMode.onUserInteraction,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          FormTextFieldWidget(
            labelKey: 'payment.paymentInfo.invoicing.name_or_company',
            controller: _nameOrCompanyController,
            border: BorderRadius.only(
              topRight: Radius.circular(16.0),
              bottomRight: Radius.circular(0.0),
              topLeft: Radius.circular(16.0),
              bottomLeft: Radius.circular(0.0),
            ),
            keyboardType: TextInputType.text,
            autofocus: true,
          ),
          FormTextFieldWidget(
            labelKey: 'payment.paymentInfo.invoicing.tax_id',
            controller: _taxNumberController,
            border: BorderRadius.only(
              topRight: Radius.circular(0.0),
              bottomRight: Radius.circular(0.0),
              topLeft: Radius.circular(0.0),
              bottomLeft: Radius.circular(0.0),
            ),
            keyboardType: TextInputType.number,
            validator: taxFieldValidator,
          ),
          customCountryPickerWidget(
              theme,
              context,
              trans('payment.paymentInfo.invoicing.country'),
              _countryController,
              _countryCodeController),
          FormTextFieldWidget(
            labelKey: 'payment.paymentInfo.invoicing.zip',
            controller: _zipController,
            border: BorderRadius.only(
              topRight: Radius.circular(0.0),
              bottomRight: Radius.circular(0.0),
              topLeft: Radius.circular(0.0),
              bottomLeft: Radius.circular(0.0),
            ),
            keyboardType: TextInputType.number,
            validator: requiredValidator(context),
          ),
          FormTextFieldWidget(
            labelKey: 'payment.paymentInfo.invoicing.city',
            controller: _cityController,
            border: BorderRadius.only(
              topRight: Radius.circular(0.0),
              bottomRight: Radius.circular(0.0),
              topLeft: Radius.circular(0.0),
              bottomLeft: Radius.circular(0.0),
            ),
            keyboardType: TextInputType.text,
            validator: requiredValidator(context),
          ),
          FormTextFieldWidget(
            labelKey: 'payment.paymentInfo.invoicing.street_address',
            controller: _streetController,
            border: BorderRadius.only(
              topRight: Radius.circular(0.0),
              bottomRight: Radius.circular(0.0),
              topLeft: Radius.circular(0.0),
              bottomLeft: Radius.circular(0.0),
            ),
            keyboardType: TextInputType.text,
            validator: requiredValidator(context),
          ),
          FormTextFieldWidget(
            labelKey: 'payment.paymentInfo.invoicing.invoice_email',
            controller: _emailController,
            border: BorderRadius.only(
              topRight: Radius.circular(0.0),
              bottomRight: Radius.circular(16.0),
              topLeft: Radius.circular(0.0),
              bottomLeft: Radius.circular(16.0),
            ),
            keyboardType: TextInputType.emailAddress,
            validator: emailValidator(context),
          ),
        ],
      ),
    );
  }

  Widget _buildSendCartButton(BuildContext context, GeoUnit unit) {
    return BlocBuilder<CartBloc, BaseCartState>(builder: (context, state) {
      bool loading = state is CartLoadingState;

      return Container(
        height: 90.0,
        padding: EdgeInsets.only(
          top: 21.0,
          left: 14.0,
          right: 14.0,
          bottom: 14.0,
        ),
        margin: EdgeInsets.only(bottom: Platform.isIOS ? 20 : 0),
        width: double.infinity,
        child: ElevatedButton(
            style: ElevatedButton.styleFrom(
              primary: theme.button,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(40),
              ),
            ),
            child: loading
                ? CenterLoadingWidget(
                    color: theme.buttonText,
                    size: 20.0,
                    strokeWidth: 2.0,
                  )
                : Text(
                    trans('payment.paymentInfo.invoicing.save'),
                    style: Fonts.satoshi(
                      fontSize: 18,
                      color: theme.buttonText,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
            onPressed: () {
              final formValid =
                  profileFormKey.currentState?.validate() ?? false;
              if (formValid) {
                setState(() {
                  _showErrorMessage = false;
                });
                UserInvoiceAddress invoiceAddress = UserInvoiceAddress(
                  customerName: _nameOrCompanyController.text,
                  email: _emailController.text,
                  taxNumber: _taxNumberController.text,
                  country: _countryController.text,
                  postalCode: _zipController.text,
                  city: _cityController.text,
                  streetAddress: _streetController.text,
                );

                Nav.pop(invoiceAddress);
              } else {
                setState(() {
                  _showErrorMessage = true;
                });
              }
            }),
      );
    });
  }

  void _setTextFieldValue(TextEditingController textController, String value) {
    textController.value = textController.value.copyWith(
      text: value,
      selection: TextSelection.collapsed(offset: value.length),
    );
  }
}
