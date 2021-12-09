import 'dart:io';

import 'package:equatable/equatable.dart';
import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/core/dependency_indjection/dependency_injection.dart';
import 'package:fa_prev/core/theme/theme.dart';
import 'package:fa_prev/core/units/units.dart';
import 'package:fa_prev/graphql/generated/crud-api.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/cart/cart.dart';
import 'package:fa_prev/modules/cart/widgets/invoice_form_bottom_sheet.dart';
import 'package:fa_prev/modules/main/main.dart';
import 'package:fa_prev/modules/payment/stripe/stripe.dart';
import 'package:fa_prev/shared/exception.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/shared/nav.dart';
import 'package:fa_prev/shared/user-details/user_details.dart';
import 'package:fa_prev/shared/widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_svg/flutter_svg.dart';

class PaymentMethodExt extends Equatable {
  final PaymentMethod method;
  final String? cardId;

  const PaymentMethodExt({required this.method, this.cardId});

  @override
  List<Object?> get props => [method, cardId];
}

class SelectPaymentMethodScreen extends StatefulWidget {
  final String? orderId;
  const SelectPaymentMethodScreen({Key? key, this.orderId}) : super(key: key);

  @override
  _SelectPaymentMethodScreenState createState() => _SelectPaymentMethodScreenState();
}

class _SelectPaymentMethodScreenState extends State<SelectPaymentMethodScreen> {
  bool _wantsInvoce = false;

  PaymentMethodExt? _selectedPaymentMethod;
  UserInvoiceAddress? _address;

  bool _loading = false;

  @override
  void initState() {
    super.initState();
    getIt<StripePaymentBloc>().add(PaymentMethodListEvent());
    getIt<UserDetailsBloc>().add(GetUserDetailsEvent());
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: theme.secondary0,
        centerTitle: true,
        elevation: 5.0,
        shadowColor: theme.secondary.withOpacity(0.1),
        leading: Padding(
          padding: const EdgeInsets.only(
            top: 8.0,
            bottom: 8.0,
            left: 15.0,
          ),
          child: BackButtonWidget(
            color: theme.secondary,
            showBorder: true,
            icon: Icons.arrow_back_outlined,
          ),
        ),
        title: Text(
          trans('payment.title'),
          style: Fonts.satoshi(
            fontSize: 16,
            color: theme.secondary,
            fontWeight: FontWeight.w700,
          ),
          textAlign: TextAlign.center,
        ),
      ),
      body: MultiBlocListener(
        listeners: [
          BlocListener<CartBloc, BaseCartState>(
            listener: (BuildContext context, BaseCartState state) {
              if (state is EmptyCartState) {
                Nav.pop();
              } else if (state is CartErrorState) {
                Nav.pop();
              }
            },
          ),
          BlocListener<StripePaymentBloc, StripePaymentState>(
            listener: (BuildContext context, StripePaymentState state) {
              if (state is StripeOperationSuccess) {
                setState(() {
                  _loading = false;
                });
                final scaffold = ScaffoldMessenger.of(context);
                scaffold.showSnackBar(SnackBar(
                  content: Text(trans('payment.stripe.payment_success')),
                ));
                Nav.pop();
                getIt<MainNavigationBloc>().add(DoMainNavigation(pageIndex: 2));
              }
              if (state is StripeError) {
                setState(() {
                  _loading = false;
                });
                getIt<ExceptionBloc>().add(
                  ShowException(
                    StripeException(
                      code: state.code,
                      message: state.message,
                    ),
                  ),
                );
                Nav.pop();
              }
            },
          )
        ],
        child: BlocBuilder<UnitSelectBloc, UnitSelectState>(
          builder: (context, unitState) {
            if (unitState is UnitSelected) {
              print('Unit selected=${unitState.unit.name}');
              return _buildPaymentMethodList(context, unitState.unit);
            }

            return CenterLoadingWidget();
          },
        ),
      ),
    );
  }

  Widget _buildPaymentMethodList(BuildContext context, GeoUnit unit) {
    // print('_buildPaymentMethodList().unit.paymentModes=${unit.id}: ${unit.paymentModes}');

    if (_loading) {
      return CenterLoadingWidget();
    }

    List<PaymentMethod> methods = [];
    if (unit.paymentModes != null) {
      for (PaymentMode? paymentMode in unit.paymentModes!) {
        if (paymentMode != null) {
          methods.add(paymentMode.method);
        }
      }
    }

    return Container(
      color: theme.secondary0,
      padding: EdgeInsets.only(
        top: 18.0,
      ),
      child: Stack(
        children: [
          SingleChildScrollView(
            physics: BouncingScrollPhysics(),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                if (unit.paymentModes != null && methods.contains(PaymentMethod.inapp))
                  _buildStripePaymentMethodBottomSheetRadioItem(context),
                if (unit.paymentModes != null && methods.contains(PaymentMethod.cash))
                  _buildSelectPaymentMethodBottomSheetRadioItem(context, 'payment.method.cash',
                      "assets/icons/payment-cash.svg", PaymentMethodExt(method: PaymentMethod.cash)),
                if (unit.paymentModes != null && methods.contains(PaymentMethod.card))
                  _buildSelectPaymentMethodBottomSheetRadioItem(context, 'payment.method.creditCard',
                      "assets/icons/payment-card.svg", PaymentMethodExt(method: PaymentMethod.card)),
                Padding(
                  padding: const EdgeInsets.only(
                    top: 64.0,
                    left: 16.0,
                    right: 16.0,
                  ),
                  child: Text(
                    trans('payment.paymentInfo.invoicing.title'),
                    style: Fonts.satoshi(
                      fontSize: 16,
                      color: theme.secondary,
                      fontWeight: FontWeight.w700,
                    ),
                    textAlign: TextAlign.center,
                  ),
                ),
                BlocListener<UserDetailsBloc, UserDetailsState>(
                  listener: (BuildContext context, UserDetailsState state) {
                    if (state is UserDetailsLoaded) {
                      print('USER ADDRESS LOADED=${state.userDetails.invoiceAddress}');
                      setState(() {
                        _address = state.userDetails.invoiceAddress;
                        // _address = UserInvoiceAddress(
                        //   customerName: 'Bátori Gábor',
                        //   taxNumber: '12345678-11',
                        //   country: 'Magyarország',
                        //   city: 'Budapest',
                        //   streetAddress: 'Tóth Kálmán utca 33/B',
                        //   postalCode: '1097',
                        //   email: 'batori.gabor@gmail.com',
                        // );
                      });
                    }
                  },
                  child: _buildWantInvoiceForm(),
                ),
              ],
            ),
          ),
          Align(
            alignment: Alignment.bottomCenter,
            child: _buildSendCartButton(context, unit),
          ),
        ],
      ),
    );
  }

  Widget _buildWantInvoiceForm() {
    return Padding(
      padding: const EdgeInsets.only(
        left: 16,
        top: 16,
        bottom: 16,
        right: 12,
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.start,
        children: [
          BorderedWidget(
            child: Padding(
              padding: const EdgeInsets.all(6.0),
              child: Icon(
                Icons.receipt_long_outlined,
                color: theme.secondary,
                size: 20,
              ),
            ),
          ),
          SizedBox(width: 16.0),
          _address == null
              ? Expanded(
                  child: Text(
                    trans('payment.paymentInfo.invoicing.want_invoice'),
                    style: Fonts.satoshi(
                      fontSize: 16,
                      color: theme.secondary,
                      fontWeight: FontWeight.w400,
                    ),
                    textAlign: TextAlign.left,
                  ),
                )
              : Flexible(
                  child: InkWell(
                    onTap: () async {
                      var newAddress = await showInvoiceFormBottomSheet(
                          context, _address, _getPaymentModeFromSelection(_selectedPaymentMethod));
                      if (newAddress != null) {
                        setState(() {
                          _address = newAddress;
                        });
                      }
                    },
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          '${_address!.customerName}, ${_address!.postalCode}, ${_address!.city}, ${_address!.streetAddress}',
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          // softWrap: true,
                          style: Fonts.satoshi(
                            fontSize: 16.0,
                            color: theme.secondary,
                          ),
                        ),
                        Text(
                          'Módosítás',
                          style: Fonts.satoshi(
                            fontSize: 12.0,
                            color: theme.secondary40,
                          ),
                        )
                      ],
                    ),
                  ),
                ),
          Transform.scale(
            scale: 1.5,
            child: Checkbox(
              shape: CircleBorder(
                  side: BorderSide(
                color: theme.primary,
                style: BorderStyle.solid,
              )),
              activeColor: theme.primary,
              fillColor: MaterialStateColor.resolveWith((states) {
                if (states.isEmpty) {
                  return theme.secondary16;
                }
                var state = states.first;
                switch (state) {
                  case MaterialState.selected:
                    return theme.primary;
                  default:
                    return theme.secondary;
                }
              }),
              value: _wantsInvoce,
              onChanged: (selected) async {
                if (_address == null) {
                  _address = await showInvoiceFormBottomSheet(
                      context, null, _getPaymentModeFromSelection(_selectedPaymentMethod));
                }
                setState(() {
                  _wantsInvoce = _address != null && !_wantsInvoce;
                });
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSendCartButton(BuildContext context, GeoUnit unit) {
    return BlocBuilder<StripePaymentBloc, StripePaymentState>(
      builder: (context, state) {
        bool loading = state is StripePaymentLoading;
        bool isPaymentMethodSelected = _selectedPaymentMethod != null &&
            ((_selectedPaymentMethod!.method == PaymentMethod.inapp && _selectedPaymentMethod!.cardId != null) ||
                _selectedPaymentMethod!.method == PaymentMethod.card ||
                _selectedPaymentMethod!.method == PaymentMethod.cash);

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
              primary: theme.primary,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(40),
              ),
            ),
            child: loading
                ? CenterLoadingWidget(
                    color: theme.secondary0,
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
            onPressed: isPaymentMethodSelected
                ? () async {
                    if (!loading) {
                      print(
                          'StartPayment._selectedPaymentMethod=$_selectedPaymentMethod, invoce=${_wantsInvoce ? _address : null}');
                      setState(() {
                        _loading = true;
                      });
                      if (_selectedPaymentMethod!.method == PaymentMethod.inapp) {
                        getIt<StripePaymentBloc>().add(StartStripePaymentWithExistingCardEvent(
                          orderId: widget.orderId,
                          paymentMethodId: _selectedPaymentMethod!.cardId!,
                          invoiceAddress: _address,
                        ));
                      } else {
                        getIt<StripePaymentBloc>().add(StartExternalPaymentEvent(
                          paymentMode: _getPaymentModeFromSelection(_selectedPaymentMethod),
                          orderId: widget.orderId,
                          invoiceAddress: _address,
                        ));
                      }
                    }
                  }
                : null,
          ),
        );
      },
    );
  }

  Widget _buildStripePaymentMethodBottomSheetRadioItem(BuildContext context) {
    return BlocBuilder<StripePaymentBloc, StripePaymentState>(
      builder: (context, state) {
        if (state is StripePaymentMethodsList) {
          if (state.data == null || state.data!.isEmpty) {
            return _buildSelectPaymentMethodBottomSheetRadioItem(
              context,
              'payment.method.inAppPayment',
              "assets/icons/payment-stripe.svg",
              PaymentMethodExt(method: PaymentMethod.inapp),
              () => showAddPaymentMethodBottomSheet(context),
              (value) {
                setState(() {
                  _selectedPaymentMethod = value;
                });
                showAddPaymentMethodBottomSheet(context);
              },
            );
          }

          return Column(
            mainAxisAlignment: MainAxisAlignment.start,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              ListView.separated(
                shrinkWrap: true,
                itemCount: state.data!.length,
                separatorBuilder: (context, index) => Divider(
                  height: 1.0,
                  color: theme.secondary16,
                ),
                itemBuilder: (context, index) {
                  StripePaymentMethod method = state.data![index];
                  return ListTile(
                    onTap: () => setState(() {
                      _selectedPaymentMethod = PaymentMethodExt(method: PaymentMethod.inapp, cardId: method.id);
                    }),
                    contentPadding: EdgeInsets.only(right: 12.0, left: 16.0),
                    title: Text(
                      '${method.brand} **** ${method.last4}',
                      style: Fonts.satoshi(
                        color: theme.secondary,
                        fontSize: 16.0,
                      ),
                    ),
                    subtitle: Text(
                      '${method.expMonth}/${method.expYear}',
                      style: Fonts.satoshi(
                        color: theme.secondary40,
                        fontSize: 12.0,
                      ),
                    ),
                    leading: Padding(
                      padding: EdgeInsets.zero,
                      child: Container(
                        width: 44,
                        height: 32,
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(4.0),
                          color: theme.secondary12,
                        ),
                        padding: EdgeInsets.symmetric(
                          horizontal: 7.0,
                          vertical: 4.0,
                        ),
                        child: (method.brand == 'mastercard' || method.brand == 'visa' || method.brand == 'maestro')
                            ? SvgPicture.asset(
                                'assets/icons/brand-${method.brand}.svg',
                                // height: 73.0,
                                // width: 73.0,
                                // fit: BoxFit.cover,
                              )
                            : Container(),
                      ),
                    ),
                    trailing: Theme(
                      data: Theme.of(context).copyWith(
                        unselectedWidgetColor: theme.secondary16, // Radio disabled color
                      ),
                      child: Transform.scale(
                        scale: 1.5,
                        child: Radio<PaymentMethodExt>(
                          value: PaymentMethodExt(method: PaymentMethod.inapp, cardId: method.id),
                          groupValue: _selectedPaymentMethod,
                          onChanged: (PaymentMethodExt? value) {
                            setState(() {
                              _selectedPaymentMethod = value;
                            });
                          },
                          activeColor: theme.primary, // Radio selected color
                        ),
                      ),
                    ),
                  );
                },
              ),
              InkWell(
                onTap: () {
                  showAddPaymentMethodBottomSheet(context);
                },
                child: Padding(
                  padding: const EdgeInsets.only(
                    top: 16.0,
                    left: 16.0,
                    bottom: 24.0,
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        trans('payment.method.addNewCard'),
                        style: Fonts.satoshi(
                          color: theme.primary,
                          fontSize: 16.0,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              // SizedBox(
              //   height: 24.0,
              // ),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16.0),
                child: Divider(
                  height: 1,
                  color: theme.secondary16,
                ),
              )
            ],
          );

          // return state.data.map((e) => Container()).toList();
        }

        return CenterLoadingWidget(
          size: 24,
        );
        // return Container();
      },
    );
  }

  Widget _buildSelectPaymentMethodBottomSheetRadioItem(
      BuildContext context, String titleKey, String icon, PaymentMethodExt value,
      [GestureTapCallback? onTap, ValueChanged<PaymentMethodExt?>? onChanged]) {
    return InkWell(
      onTap: onTap != null
          ? onTap
          : () {
              setState(() {
                _selectedPaymentMethod = value;
              });
            },
      child: Container(
        margin: const EdgeInsets.only(
          top: 8.0,
          left: 16.0,
        ),
        child: Column(
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.start,
              children: [
                Padding(
                  padding: EdgeInsets.zero,
                  child: Container(
                    width: 44,
                    height: 32,
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(4.0),
                      color: theme.secondary12,
                    ),
                    padding: EdgeInsets.symmetric(
                      horizontal: 7.0,
                      vertical: 4.0,
                    ),
                    margin: EdgeInsets.only(
                      right: 16.0,
                    ),
                    child: SvgPicture.asset(
                      icon,
                      color: theme.secondary,
                      // height: 73.0,
                      // width: 48.0,
                      // fit: BoxFit.fitWidth,
                    ),
                  ),
                ),
                Expanded(
                  child: Text(
                    trans(titleKey),
                    style: Fonts.satoshi(
                      fontSize: 16.0,
                      fontWeight: FontWeight.w600,
                      color: theme.secondary,
                    ),
                  ),
                ),
                Theme(
                  data: Theme.of(context).copyWith(
                    unselectedWidgetColor: theme.secondary16, // Radio disabled color
                  ),
                  child: Container(
                    padding: EdgeInsets.only(
                      right: 10.0,
                    ),
                    child: Transform.scale(
                      scale: 1.5,
                      child: Radio<PaymentMethodExt>(
                        value: value,
                        groupValue: _selectedPaymentMethod,
                        onChanged: (PaymentMethodExt? value) => onChanged != null
                            ? onChanged(value)
                            : setState(() {
                                _selectedPaymentMethod = value;
                              }),

                        activeColor: theme.primary, // Radio selected color
                      ),
                    ),
                  ),
                ),
              ],
            ),
            SizedBox(
              height: 8.0,
            ),
            Padding(
              padding: const EdgeInsets.only(right: 24.0),
              child: Divider(
                color: theme.secondary16,
                height: 1,
              ),
            ),
            // if (isSelected && info != null) ...[info, SizedBox(height: 14.0)]
          ],
        ),
      ),
    );
  }

  static PaymentMode _getPaymentModeFromSelection(PaymentMethodExt? selectedMethod) {
    switch (selectedMethod?.method ?? PaymentMethod.artemisUnknown) {
      case PaymentMethod.cash:
        return PaymentMode(method: PaymentMethod.cash, type: PaymentType.cash, caption: 'cash');
      case PaymentMethod.card:
        return PaymentMode(method: PaymentMethod.card, type: PaymentType.card, caption: 'card');
      case PaymentMethod.inapp:
        return PaymentMode(method: PaymentMethod.inapp, type: PaymentType.stripe, caption: 'stripe');
      default:
        return PaymentMode(method: PaymentMethod.cash, type: PaymentType.cash, caption: 'cash');
    }
  }
}
