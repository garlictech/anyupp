import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/modules/cart/cart.dart';
import 'package:fa_prev/modules/selectunit/selectunit.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/shared/notifications/utils/notifications_utils.dart';
import 'package:fa_prev/shared/nav.dart';
import 'package:fa_prev/shared/utils/place_preferences.dart';
import 'package:fa_prev/shared/widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_svg/flutter_svg.dart';

typedef OnQRChecked = void Function(bool validQRCode);

class UnitFoundByQRCodeWidget extends StatefulWidget {
  final String unitId;
  final Place place;
  final bool navigateToCart;
  final bool loadUnits;
  final bool popWhenClose;
  final OnQRChecked? onQRChecked;

  const UnitFoundByQRCodeWidget({
    Key? key,
    required this.unitId,
    required this.place,
    this.onQRChecked,
    this.navigateToCart = false,
    this.loadUnits = true,
    this.popWhenClose = false,
  }) : super(key: key);

  @override
  _UnitFoundByQRCodeWidgetState createState() =>
      _UnitFoundByQRCodeWidgetState();
}

class _UnitFoundByQRCodeWidgetState extends State<UnitFoundByQRCodeWidget>
    with SingleTickerProviderStateMixin {
  final GlobalKey<FlipCardState> _flipCardState = GlobalKey<FlipCardState>();

  bool _showError = false;
  String? _errorTitle;
  String? _errorDesc;
  late AnimationController _controller;

  GeoUnit? _selectedUnit;

  @override
  void initState() {
    _controller = AnimationController(
      duration: const Duration(milliseconds: 1500),
      vsync: this,
    );
    super.initState();

    if (widget.loadUnits) {
      getIt<UnitsBloc>().add(DetectLocationAndLoadUnits());
    }

    _controller.repeat();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return BlocListener<UnitsBloc, UnitsState>(
      listener: (BuildContext context, UnitsState state) async {
        if (state is UnitsLoaded) {
          log.d('***************** UNITS LOADED');
          await _handleUnitFoundByQRCode(context, state.units);
        }
        if (state is UnitsNotLoaded) {
          setState(() {
            _showError = true;
            _errorTitle = state.reasonCode;
            _errorDesc = state.reasonMessage;
          });
        }
        if (state is UnitsNoNearUnit) {
          setState(() {
            _showError = true;
            _errorTitle = 'selectUnit.qrGeneralError.title';
            _errorDesc = 'selectUnit.qrGeneralError.description';
          });
        }
      },
      child: _showError == false
          ? Container(
              child: Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: <Widget>[
                    Spacer(),
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 56.0),
                      child: FlipCard(
                        key: _flipCardState,
                        flipOnTouch: false,
                        direction: FlipDirection.HORIZONTAL,
                        front: _buildQRCodeCard(context),
                        back: _buildConnectedToTableCard(context),
                      ),
                    ),
                    Spacer(),
                    Container(
                      width: double.infinity,
                      height: 56.0,
                      margin: const EdgeInsets.all(16.0),
                      child: _selectedUnit != null
                          ? ElevatedButton(
                              style: ElevatedButton.styleFrom(
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(40.0),
                                ),
                                primary: theme.button,
                              ),
                              onPressed: () => _continueToUnit(),
                              child: Text(
                                trans('common.ok2'),
                                style: Fonts.satoshi(
                                  fontSize: 16,
                                  fontWeight: FontWeight.w700,
                                  color: theme.buttonText,
                                ),
                              ),
                            )
                          : null,
                    )
                  ],
                ),
              ),
            )
          : CommonErrorWidget(
              error: trans(_errorTitle!),
              description: trans(_errorDesc!),
              showButton: true,
              expanded: true,
              onPressed: () {
                if (widget.popWhenClose) {
                  Nav.pop<bool>(false);
                  return;
                }
                // Nav.reset(SelectUnitChooseMethodScreen());
              },
            ),
    );
  }

  Widget _buildQRCodeCard(BuildContext context) {
    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.only(top: 25.0),
          child: RotationTransition(
            turns: Tween(begin: 0.0, end: 1.0).animate(_controller),
            child: SvgPicture.asset('assets/icons/qr-scan.svg'),
          ),
        ),
        Padding(
          padding: const EdgeInsets.only(top: 46.0),
          child: Column(
            children: [
              Text(
                widget.place.seat != null
                    ? trans('selectUnit.findingSeat')
                    : trans('selectUnit.findingTable'),
                textAlign: TextAlign.center,
                style: Fonts.satoshi(
                  fontSize: 18.0,
                  fontWeight: FontWeight.w700,
                  color: Color(0xFF373737),
                ),
              ),
              SizedBox(
                height: 16.0,
              ),
              Text(
                trans('selectUnit.findingSeatLoading'),
                textAlign: TextAlign.center,
                style: Fonts.satoshi(
                  fontSize: 14.0,
                  fontWeight: FontWeight.w400,
                  color: Color(0xFF373737),
                ),
              ),
            ],
          ),
        )
      ],
    );
  }

  Widget _buildConnectedToTableCard(BuildContext context) {
    String tableString =
        trans('selectUnit.tableFound.table', [widget.place.table]);
    if (widget.place.seat != null) {
      tableString +=
          ", " + trans('selectUnit.tableFound.seat', [widget.place.seat]);
    }
    return Column(
      children: [
        SvgPicture.asset('assets/icons/success_order.svg'),
        Padding(
          padding: const EdgeInsets.only(top: 46.0),
          child: Text(
            tableString,
            textAlign: TextAlign.center,
            style: Fonts.satoshi(
              fontSize: 18.0,
              fontWeight: FontWeight.w700,
              color: Color(0xFF3C2F2F),
            ),
          ),
        ),
        Padding(
          padding: const EdgeInsets.only(
            top: 16.0,
            bottom: 30.0,
          ),
          child: Text(
            trans('selectUnit.tableFound.description'),
            textAlign: TextAlign.center,
            style: Fonts.satoshi(
              fontSize: 14.0,
              fontWeight: FontWeight.w400,
              color: Color(0xFF373737),
            ),
          ),
        ),
      ],
    );
  }

  Future<void> _handleUnitFoundByQRCode(
    BuildContext context,
    List<GeoUnit> units,
  ) async {
    int index = units.indexWhere((GeoUnit unit) => unit.id == widget.unitId);
    GeoUnit? unit = index >= 0 ? units[index] : null;
    if (unit != null) {
      log.d('***************** UNIT FOUND FOR QR=$unit');
      await setPlacePref(unit.id, widget.place);
      _flipCardState.currentState?.toggleCard();
      showNotification(
        title: widget.place.seat != null
            ? trans('selectUnit.seatReserved.title')
            : trans('selectUnit.tableReserved.title'),
        message: widget.place.seat != null
            ? trans('selectUnit.seatReserved.description',
                [widget.place.table, widget.place.seat])
            : trans(
                'selectUnit.tableReserved.description', [widget.place.table]),
      );
      getIt<UnitSelectBloc>().add(SelectUnit(unit));
      getIt<CartBloc>().add(UpdatePlaceInCartAction(unit, widget.place));
      setState(() {
        _selectedUnit = unit;
      });
    } else {
      // Set error
      setState(() {
        _showError = true;
        _errorTitle = 'selectUnit.qrCodeError.title';
        _errorDesc = 'selectUnit.qrCodeError.description';
      });
    }
  }

  Future<void> _continueToUnit() async {
    // --- Wait for animation finish
    // await Future.delayed(Duration(milliseconds: 1000));
    // Nav.pop();
    log.e('_continueToUnit().popWhenClose=${widget.popWhenClose}');
    log.e('_continueToUnit().navigateToCart=${widget.navigateToCart}');

    if (widget.popWhenClose && widget.onQRChecked != null) {
      // Nav.pop();
      widget.onQRChecked!(true);
      return;
    }

    log.e('_continueToUnit().onQRChecked=${widget.onQRChecked}');
    if (widget.onQRChecked != null) {
      widget.onQRChecked!(true);
    }
    Nav.pop();
    await selectUnitAndGoToMenuScreen(context, _selectedUnit!,
        dismissable: false, showSelectServingMode: widget.navigateToCart);
  }
}
