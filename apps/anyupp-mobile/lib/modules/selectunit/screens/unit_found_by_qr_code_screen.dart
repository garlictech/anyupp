import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/core/theme/theme.dart';
import 'package:fa_prev/modules/cart/cart.dart';
import 'package:fa_prev/modules/selectunit/selectunit.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/modules/screens.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/shared/utils/local_notifications_util.dart';
import 'package:fa_prev/shared/nav.dart';
import 'package:fa_prev/shared/utils/place_preferences.dart';
import 'package:fa_prev/shared/widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_svg/flutter_svg.dart';

class UnitFoundByQRCodeScreen extends StatefulWidget {
  final String unitId;
  final Place place;
  final bool navigateToCart;
  final bool loadUnits;

  UnitFoundByQRCodeScreen({
    required this.unitId,
    required this.place,
    this.navigateToCart = false,
    this.loadUnits = true,
  });

  @override
  _UnitFoundByQRCodeScreenState createState() =>
      _UnitFoundByQRCodeScreenState();
}

class _UnitFoundByQRCodeScreenState extends State<UnitFoundByQRCodeScreen> {
  final GlobalKey<FlipCardState> _flipCardState = GlobalKey<FlipCardState>();

  @override
  void initState() {
    super.initState();
    setToolbarThemeV1(theme);

    // print('*** _UnitFoundByQRCodeScreenState.initState().navigateToCart=${widget.navigateToCart}');
    // _loaded = false;
    if (widget.loadUnits) {
      getIt<UnitsBloc>().add(DetectLocationAndLoadUnits());
    }
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Scaffold(
        backgroundColor: Colors.white,
        body: BlocListener<UnitsBloc, UnitsState>(
          listener: (BuildContext context, UnitsState state) async {
            // if (!widget.navigateToCart && _loaded) {
            //   print('***************** UnitFoundByQRCodeScreen.ALREADY LOADED!!!');
            //   return;
            // }
            // _loaded = true;
            if (state is UnitsLoaded) {
              print('***************** UNITS LOADED=${state.units}');
              int index = state.units
                  .indexWhere((GeoUnit unit) => unit.id == widget.unitId);
              GeoUnit? unit = index >= 0 ? state.units[index] : null;
              if (unit != null) {
                // unit = unit.copyWith(place: widget.place);
                // print('***************** UNITS FOUND=$unit');
                await setPlacePref(unit.id, widget.place);
                _flipCardState.currentState?.toggleCard();
                showNotification(
                    context,
                    trans('selectUnit.tableReserved.title'),
                    trans('selectUnit.tableReserved.description',
                        [widget.place.table, widget.place.seat]),
                    null);
                getIt<UnitSelectBloc>().add(SelectUnit(unit));
                getIt<CartBloc>()
                    .add(UpdatePlaceInCartAction(unit, widget.place));
                await Future.delayed(Duration(
                  milliseconds: 1000,
                ));
                if (widget.navigateToCart) {
                  // await showSelectServingModeSheet(context);
                  Nav.reset(MainNavigation(
                      // pageIndex: widget.navigateToCart ? 4 : 0,
                      ));
                } else {
                  int? selected = await selectUnitAndGoToMenuScreen(
                    context,
                    unit,
                    dismissable: false,
                  );
                  if (selected == null) {
                    Nav.reset(SelectUnitChooseMethodScreen());
                  }
                }
              } else {
                showErrorDialog(context, trans('selectUnit.qrCodeError.title'),
                    trans('selectUnit.qrCodeError.description'),
                    onClose: () => Nav.reset(SelectUnitChooseMethodScreen()));
              }
            }
            if (state is UnitsNotLoaded) {
              //showErrorDialog(context, trans('selectUnit.qrUnitsError.title'), trans('selectUnit.qrUnitsError.description'), () =>
              showErrorDialog(
                  context, state.reasonCode, state.reasonMessage ?? '',
                  onClose: () => Nav.reset(SelectUnitChooseMethodScreen()));
            }
            if (state is UnitsNoNearUnit) {
              showErrorDialog(context, trans('selectUnit.qrGeneralError.title'),
                  trans('selectUnit.qrGeneralError.description'),
                  onClose: () => Nav.reset(SelectUnitChooseMethodScreen()));
            }
          },
          child: Container(
            padding: EdgeInsets.all(12.0),
            child: Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: <Widget>[
                  FlipCard(
                    key: _flipCardState,
                    flipOnTouch: false,
                    direction: FlipDirection.HORIZONTAL,
                    front: _buildQRCodeCard(context),
                    back: _buildConnectedToTableCard(context),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildQRCodeCard(BuildContext context) {
    return Container(
      width: MediaQuery.of(context).size.width,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(12.0),
        border: Border.all(
          width: 1.5,
          color: Color(0xFFE7E5D0),
        ),
      ),
      child: Column(
        children: [
          Padding(
            padding: const EdgeInsets.only(top: 25.0),
            child: SvgPicture.asset('assets/icons/qr-scan.svg'),
          ),
          Padding(
            padding: const EdgeInsets.only(top: 25.0, bottom: 20.0),
            child: Column(
              children: [
                Text(
                  trans('selectUnit.findingSeat'),
                  textAlign: TextAlign.center,
                  style: Fonts.satoshi(
                    fontSize: 16.0,
                    fontWeight: FontWeight.w600,
                    color: Color(0xFF3C2F2F),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.only(top: 8.0),
                  child: CenterLoadingWidget(
                    backgroundColor: Colors.white,
                    color: theme.primary,
                    size: 20,
                    strokeWidth: 2.0,
                  ),
                )
              ],
            ),
          )
        ],
      ),
    );
  }

  Widget _buildConnectedToTableCard(BuildContext context) {
    return Container(
      width: MediaQuery.of(context).size.width,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(12.0),
        border: Border.all(
          width: 1.5,
          color: Color(0xFFE7E5D0),
        ),
      ),
      child: Column(
        children: [
          Padding(
            padding: const EdgeInsets.only(top: 35.0),
            child: SvgPicture.asset('assets/icons/link.svg'),
          ),
          Padding(
            padding: const EdgeInsets.only(top: 25.0),
            child: Text(
              trans('selectUnit.qrConnected'),
              textAlign: TextAlign.center,
              style: Fonts.satoshi(
                fontSize: 14.0,
                fontWeight: FontWeight.w400,
                color: Color(0xFF3C2F2F),
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.only(bottom: 30.0),
            child: Text(
              trans(
                  'selectUnit.chair', [widget.place.seat, widget.place.table]),
              textAlign: TextAlign.center,
              style: Fonts.satoshi(
                fontSize: 18.0,
                fontWeight: FontWeight.w700,
                color: Color(0xFF3C2F2F),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
