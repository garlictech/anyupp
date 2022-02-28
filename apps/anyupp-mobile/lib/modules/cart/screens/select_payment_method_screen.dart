import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/graphql/generated/crud-api.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/cart/cart.dart';
import 'package:fa_prev/modules/cart/widgets/payment/payment_success_widget.dart';
import 'package:fa_prev/modules/payment/stripe/stripe.dart';
import 'package:fa_prev/modules/selectunit/screens/flutter_qr_code_scanner.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/shared/nav.dart';
import 'package:fa_prev/shared/user-details/user_details.dart';
import 'package:fa_prev/shared/widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../main/bloc/main_navigation_bloc.dart';
import '../../main/bloc/main_navigation_event.dart';

class SelectPaymentMethodScreen extends StatefulWidget {
  final String? orderId;
  final GeoUnit unit;
  final Cart cart;
  const SelectPaymentMethodScreen({
    Key? key,
    required this.unit,
    required this.cart,
    this.orderId,
  }) : super(key: key);

  @override
  _SelectPaymentMethodScreenState createState() =>
      _SelectPaymentMethodScreenState();
}

class _SelectPaymentMethodScreenState extends State<SelectPaymentMethodScreen> {
  bool _wantsInvoce = false;

  PaymentMethodExt? _selectedPaymentMethod;
  UserInvoiceAddress? _address;
  List<PaymentMethod> _methods = [];
  late OrderPolicy _orderPolicy;
  bool _loading = false;
  bool _placeSelected = false;
  bool? _orderCreationSuccess;

  @override
  void initState() {
    super.initState();
    _orderPolicy = widget.unit.orderPolicy;

    if (widget.unit.paymentModes != null) {
      for (PaymentMode? paymentMode in widget.unit.paymentModes!) {
        if (paymentMode != null) {
          _methods.add(paymentMode.method);
        }
      }
    }

    _placeSelected = widget.cart.place?.isNotEmpty ?? false;
    print('SelectPaymentMethodScreen._placeSelected=$_placeSelected');
    print('SelectPaymentMethodScreen._orderPolicy=$_orderPolicy');
    _checkInitialStatus();
  }

  Future<void> _checkInitialStatus() async {
    if (_orderPolicy == OrderPolicy.full) {
      getIt<StripePaymentBloc>().add(PaymentMethodListEvent());
      getIt<UserDetailsBloc>().add(GetUserDetailsEvent());
    }

    if (_orderPolicy == OrderPolicy.placeOnly) {
      if (!_placeSelected) {
        await Future.delayed(Duration.zero);
        bool? success = await Nav.toWithResult<bool>(QRCodeScannerScreen(
          popWhenClose: true,
          loadUnits: true,
        ));
        print('SelectPaymentMethodScreen.QRCodeScannerScreen.success=$success');
        if (success != true) {
          Nav.pop();
          return;
        }
        _placeSelected = true;
      }

      // --- QR scan success, start payment.
      // print('SelectPaymentMethodScreen.START PAYMENT!');
      setState(() {
        _loading = true;
      });
      getIt<CartBloc>().add(CreateAndSendOrder(widget.unit, 'cash'));
    }
  }

  showStatusModal() async {
    Nav.pop();
    Nav.pop();
    getIt<MainNavigationBloc>().add(DoMainNavigation(pageIndex: 2));
    return showModalBottomSheet(
      context: context,
      isDismissible: true,
      // shape: RoundedRectangleBorder(
      //   borderRadius: BorderRadius.only(
      //     topLeft: Radius.circular(16.0),
      //     topRight: Radius.circular(16.0),
      //   ),
      // ),
      enableDrag: true,
      isScrollControlled: true,
      elevation: 4.0,
      backgroundColor: Colors.transparent,
      builder: (context) {
        return Container(
            decoration: BoxDecoration(
              borderRadius: BorderRadius.only(
                topLeft: Radius.circular(16.0),
                topRight: Radius.circular(16.0),
              ),
              color: theme.secondary0,
            ),
            padding: EdgeInsets.only(
             // top: 12.0,
              // left: 16.0,
              // right: 16.0,
              // bottom: 16.0,
              bottom: MediaQuery.of(context).viewInsets.bottom,
            ),
            height: MediaQuery.of(context).size.height * .9,
            child: Column(
              children: [
                Stack(
                  children: [
                    Align(
                      alignment: Alignment.topLeft,
                      child: Padding(
                        padding: const EdgeInsets.only(left: 8.0, top: 4.0),
                        child: BackButtonWidget(
                          // iconSize: 2,
                          showBorder: false,
                        ),
                      ),
                    ),
                    Align(
                      alignment: Alignment.center,
                      child: Padding(
                        padding: const EdgeInsets.only(top: 12.0),
                        child: Container(
                          height: 4.0,
                          width: 40.0,
                          margin: const EdgeInsets.only(bottom: 32.0),
                          decoration: BoxDecoration(
                            color: theme.secondary16,
                            borderRadius: const BorderRadius.all(
                              Radius.circular(8.0),
                            ),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
                Container(
                  height: MediaQuery.of(context).size.height * .8,
                  child: _orderCreationSuccess == true
                      ? PaymentSuccessWidget()
                      : _orderCreationSuccess == false
                          ? CommonErrorWidget(
                              error: 'orders.sendOrderError.title',
                              description: 'orders.sendOrderError.description',
                            )
                          : Container(),
                )
              ],
            ));
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: _loading
          ? null
          : AppBar(
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
              print('SelectPaymentMethodScreen.CartBloc.state=$state');
              if (state is EmptyCartState) {
                if (_orderPolicy != OrderPolicy.full) {
                  setState(() {
                    _loading = false;
                    _orderCreationSuccess = true;
                  });
                  showStatusModal();
                }
              }
              if (state is CartErrorState) {
                setState(() {
                  _loading = false;
                  _orderCreationSuccess = false;
                });
                showStatusModal();
                // }
              }
            },
          ),
          BlocListener<StripePaymentBloc, StripePaymentState>(
            listener: (BuildContext context, StripePaymentState state) {
              print('SelectPaymentMethodScreen.StripePaymentBloc.state=$state');
              if (state is StripeOperationSuccess) {
                setState(() {
                  _loading = false;
                  _orderCreationSuccess = true;
                });
                showStatusModal();
              }
              if (state is StripeError) {
                setState(() {
                  _loading = false;
                  _orderCreationSuccess = false;
                });
                showStatusModal();
              }
            },
          )
        ],
        child: _buildPaymentMethodList(context, widget.unit),
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
                if (_methods.contains(PaymentMethod.inapp) &&
                    _orderPolicy == OrderPolicy.full)
                  InappPaymentMethodItemWidget(
                    key: const Key('select-payment-item-inapp'),
                    selectedPaymentMethod: _selectedPaymentMethod,
                    onChanged: (value) => setState(() {
                      _selectedPaymentMethod = value;
                    }),
                  ),
                if (_methods.contains(PaymentMethod.cash) &&
                    _orderPolicy != OrderPolicy.placeOnly)
                  PaymentMethodListItemWidget(
                    key: const Key('select-payment-item-cash'),
                    icon: 'assets/icons/payment-cash.svg',
                    titleKey: 'payment.method.cash',
                    descriptionKey: 'payment.method.cashDesc',
                    value: PaymentMethodExt(method: PaymentMethod.cash),
                    selected: _selectedPaymentMethod,
                    onChanged: (value) => setState(() {
                      _selectedPaymentMethod = value;
                    }),
                  ),
                if (_methods.contains(PaymentMethod.card) &&
                    _orderPolicy != OrderPolicy.placeOnly)
                  PaymentMethodListItemWidget(
                    key: const Key('select-payment-item-card'),
                    icon: 'assets/icons/payment-card.svg',
                    titleKey: 'payment.method.creditCard',
                    descriptionKey: 'payment.method.creditCardDesc',
                    value: PaymentMethodExt(method: PaymentMethod.card),
                    selected: _selectedPaymentMethod,
                    onChanged: (value) => setState(() {
                      _selectedPaymentMethod = value;
                    }),
                  ),
                if (_orderPolicy == OrderPolicy.full)
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
                if (_orderPolicy == OrderPolicy.full)
                  BlocListener<UserDetailsBloc, UserDetailsState>(
                    listener: (BuildContext context, UserDetailsState state) {
                      if (state is UserDetailsLoaded) {
                        print(
                            'USER ADDRESS LOADED=${state.userDetails.invoiceAddress}');
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
                    child: PaymentInvoiceFormWidget(
                      selectedPaymentMethod: _selectedPaymentMethod,
                      wantsInVoice: _wantsInvoce,
                      address: _address,
                      onAddressChanged: (address) => setState(() {
                        _address = address;
                        print('onAddressChanged()=$_address');
                      }),
                      onWantInvoiceChanged: (wantInvoice) => setState(() {
                        _wantsInvoce = wantInvoice;
                        print('onWantInvoiceChanged()=$_wantsInvoce');
                      }),
                    ),
                  ),
              ],
            ),
          ),
          Align(
            alignment: Alignment.bottomCenter,
            child: SendCartButtonWidget(
              cart: widget.cart,
              selectedPaymentMethod: _selectedPaymentMethod,
              onLoading: (loading) => setState(
                () {
                  _loading = loading;
                },
              ),
              onPressed: () => _handleStartOrderPressed(),
            ),
          ),
        ],
      ),
    );
  }

  Future<void> _handleStartOrderPressed() async {
    return showModalBottomSheet(
      context: context,
      isDismissible: true,
      // shape: RoundedRectangleBorder(
      //   borderRadius: BorderRadius.only(
      //     topLeft: Radius.circular(16.0),
      //     topRight: Radius.circular(16.0),
      //   ),
      // ),
      enableDrag: true,
      isScrollControlled: true,
      elevation: 4.0,
      backgroundColor: Colors.transparent,
      builder: (context) {
        return QRCodeScannerScreen(
          popWhenClose: true,
          loadUnits: true,
        );
      },
    ).then((success) {
      if (widget.cart.isPlaceEmpty) {
        if (success != true) {
          setState(() {
            _loading = false;
          });
          return;
        }
      }
      if (_selectedPaymentMethod!.method == PaymentMethod.inapp) {
        getIt<StripePaymentBloc>().add(StartStripePaymentWithExistingCardEvent(
          orderId: widget.orderId,
          paymentMethodId: _selectedPaymentMethod!.cardId!,
          invoiceAddress: _wantsInvoce ? _address : null,
        ));
      } else {
        getIt<StripePaymentBloc>().add(StartExternalPaymentEvent(
          paymentMode: getPaymentModeFromSelection(_selectedPaymentMethod),
          orderId: widget.orderId,
          invoiceAddress: _wantsInvoce ? _address : null,
        ));
      }
    });
  }
}
