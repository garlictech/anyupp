import 'package:fa_prev/core/dependency_indjection/dependency_injection.dart';
import 'package:fa_prev/core/theme/theme.dart';
import 'package:fa_prev/core/units/units.dart';
import 'package:fa_prev/graphql/generated/anyupp-api.dart' hide PaymentMethod;
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/cart/cart.dart';
import 'package:fa_prev/modules/cart/utils/invoice_form_utils.dart';
import 'package:fa_prev/modules/payment/stripe/screens/stripe_payment_screen.dart';
import 'package:fa_prev/modules/payment/stripe/stripe.dart';
import 'package:fa_prev/modules/screens.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/shared/nav.dart';
import 'package:fa_prev/shared/user-details/user_details.dart';
import 'package:fa_prev/shared/widgets.dart';
import 'package:fa_prev/shared/widgets/country_picker_widget.dart';
import 'package:fa_prev/shared/widgets/custom_text_form_widget.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

void showInvoiceFormBottomSheet(BuildContext context, String? orderId, PaymentMode paymentMode) {
  final ThemeChainData theme = getIt<ThemeBloc>().state.theme;

  showModalBottomSheet(
    context: context,
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.only(
        topLeft: Radius.circular(16.0),
        topRight: Radius.circular(16.0),
      ),
    ),
    enableDrag: true,
    isScrollControlled: true,
    elevation: 4.0,
    backgroundColor: theme.secondary0,
    builder: (context) {
      return Padding(
        padding: MediaQuery.of(context).viewInsets,
        child: InvoiceFormBottomSheetWidget(orderId, paymentMode),
      );
    },
  );
}

class InvoiceFormBottomSheetWidget extends StatefulWidget {
  final String? orderId;
  final PaymentMode paymentMode;
  InvoiceFormBottomSheetWidget(this.orderId, this.paymentMode);
  @override
  _InvoiceFormBottomSheetWidgetState createState() => _InvoiceFormBottomSheetWidgetState();
}

class _InvoiceFormBottomSheetWidgetState extends State<InvoiceFormBottomSheetWidget> {
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
  User? _userProfile;

  @override
  void initState() {
    getIt<UserDetailsBloc>().add(GetUserDetailsEvent());

    _countryCodeController.addListener(() {
      setState(() {
        profileFormKey.currentState?.reset();
      });
    });
    super.initState();
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
          Nav.replace(MainNavigation(pageIndex: 2));
        } else if (state is CartErrorState) {
          Nav.pop();
        }
      },
      child: BlocBuilder<UnitSelectBloc, UnitSelectState>(
        builder: (context, state) {
          if (state is UnitSelected) {
            // print('Unit selected=${state.unit}');
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
    return SingleChildScrollView(
      child: Container(
        color: theme.secondary0,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          // alignment: WrapAlignment.start,
          // direction: Axis.horizontal,
          // crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            GestureDetector(
              onTap: () {
                setState(() {
                  FocusScope.of(context).unfocus();
                });
              },
              child: LayoutBuilder(
                builder: (context, constrains) {
                  return Column(
                    mainAxisAlignment: MainAxisAlignment.start,
                    children: [
                      Stack(
                        children: [
                          Container(
                            color: theme.secondary0,
                            width: constrains.maxWidth - 32,
                            height: 60,

                            // padding: const EdgeInsets.symmetric(
                            //   vertical: 19.0,
                            // ),
                            child: Center(
                              child: Text(
                                trans('payment.paymentInfo.invoicing.invoice_info'),
                                style: Fonts.satoshi(
                                  fontSize: 16,
                                  color: theme.secondary,
                                  fontWeight: FontWeight.w500,
                                ),
                                textAlign: TextAlign.center,
                              ),
                            ),
                          ),
                          Positioned(
                              right: -5,
                              top: 10,
                              child: GestureDetector(
                                onTap: () => Nav.pop(),
                                child: Icon(Icons.close),
                              ))
                        ],
                      ),
                      BlocListener<UserDetailsBloc, UserDetailsState>(
                        listener: (BuildContext context, UserDetailsState state) {
                          if (state is UserDetailsLoaded) {
                            User user = state.userDetails;
                            if (user.invoiceAddress != null) {
                              _setTextFieldValue(_nameOrCompanyController, user.invoiceAddress!.customerName);
                              _setTextFieldValue(_cityController, user.invoiceAddress!.city);
                              _setTextFieldValue(_emailController, user.invoiceAddress?.email ?? user.email!);
                              _setTextFieldValue(_zipController, user.invoiceAddress!.postalCode);
                              _setTextFieldValue(_streetController, user.invoiceAddress!.streetAddress);
                              _setTextFieldValue(_taxNumberController, user.invoiceAddress!.taxNumber);
                            }
                            setState(() {
                              _userProfile = state.userDetails;
                            });
                          }
                        },
                        child: Container(),
                      ),
                    ],
                  );
                },
              ),
            ),
            _buildInvoiceForm(context),
            _buildSendCartButton(context, unit),
          ],
        ),
      ),
    );
  }

  Widget _buildInvoiceForm(BuildContext context) {
    print('_buildInvoiceForm()=${_userProfile?.email}');

    return Container(
      color: theme.secondary0,
      padding: EdgeInsets.symmetric(
        horizontal: 14.0,
      ),
      child: Form(
        key: profileFormKey,
        // autovalidateMode: AutovalidateMode.onUserInteraction,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            customTextFormWidget(
              context,
              theme,
              trans('payment.paymentInfo.invoicing.name_or_company'),
              _nameOrCompanyController,
              TextInputType.text,
              false,
              requiredValidator(context),
            ),
            customTextFormWidget(
              context,
              theme,
              trans('payment.paymentInfo.invoicing.tax_id'),
              _taxNumberController,
              TextInputType.number,
              false,
              taxFieldValidator,
            ),
            customCountryPickerWidget(theme, context, trans('payment.paymentInfo.invoicing.country'),
                _countryController, _countryCodeController),
            customTextFormWidget(
              context,
              theme,
              trans('payment.paymentInfo.invoicing.zip'),
              _zipController,
              TextInputType.number,
              false,
              requiredValidator(context),
            ),
            customTextFormWidget(
              context,
              theme,
              trans('payment.paymentInfo.invoicing.city'),
              _cityController,
              TextInputType.text,
              false,
              requiredValidator(context),
            ),
            customTextFormWidget(
              context,
              theme,
              trans('payment.paymentInfo.invoicing.street_address'),
              _streetController,
              TextInputType.text,
              false,
              requiredValidator(context),
            ),
            customTextFormWidget(
              context,
              theme,
              trans('payment.paymentInfo.invoicing.invoice_email'),
              _emailController,
              TextInputType.emailAddress,
              false,
              emailValidator(context),
            ),
          ],
        ),
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
        width: double.infinity,
        child: ElevatedButton(
            style: ElevatedButton.styleFrom(
              primary: theme.primary,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(10),
              ),
            ),
            child: loading
                ? CenterLoadingWidget(
                    color: theme.primary,
                    size: 20.0,
                    strokeWidth: 2.0,
                  )
                : Text(
                    trans('payment.sendOrder'),
                    style: Fonts.satoshi(
                      fontSize: 18,
                      color: theme.secondary0,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
            onPressed:
                // (_selectedPaymentMethod != PAYMENT_UNKNOWN)
                //?
                () {
              final formValid = profileFormKey.currentState?.validate() ?? false;
              if (formValid) {
                // BlocProvider.of<CartBloc>(context).add(AddInvoiceInfo(
                //     InvoiceInfo(
                //         name: _nameOrCompanyController.text,
                //         invoiceMail: _emailController.text,
                //         taxNumber: _taxNumberController.text,
                //         country: _countryController.text,
                //         postalCode: _zipController.text,
                //         city: _cityController.text,
                //         streetAddress: _streetController.text)));

                UserInvoiceAddress invoiceAddress = UserInvoiceAddress(
                  customerName: _nameOrCompanyController.text,
                  email: _emailController.text,
                  taxNumber: _taxNumberController.text,
                  country: _countryController.text,
                  postalCode: _zipController.text,
                  city: _cityController.text,
                  streetAddress: _streetController.text,
                );

                if (widget.paymentMode.method == PaymentMethod.inapp) {
                  Nav.pop();
                  Nav.to(StripePaymentScreen(
                    orderId: widget.orderId,
                    invoiceAddress: invoiceAddress,
                  ));
                } else {
                  Nav.pop();
                  getIt<StripePaymentBloc>().add(StartExternalPaymentEvent(
                    // cart: widget.cart,
                    orderId: widget.orderId,
                    paymentMode: widget.paymentMode,
                    invoiceAddress: invoiceAddress,
                  ));
                }
              }
            }
            //: null,
            ),
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
