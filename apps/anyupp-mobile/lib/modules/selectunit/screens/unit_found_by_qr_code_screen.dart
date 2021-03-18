import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/core/theme/theme.dart';
import 'package:fa_prev/modules/cart/cart.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/modules/screens.dart';
import 'package:fa_prev/shared/models.dart';
import 'package:fa_prev/shared/utils/local_notifications_util.dart';
import 'package:fa_prev/shared/nav.dart';
import 'package:fa_prev/shared/utils/place_preferences.dart';
import 'package:fa_prev/shared/widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:google_fonts/google_fonts.dart';

class UnitFoundByQRCodeScreen extends StatefulWidget {
  final String unitId;
  final Place place;
    // TODO navigation hack, should replace with navigation bloc 
  final bool navigateToCart;

  UnitFoundByQRCodeScreen({Key key, @required this.unitId, @required this.place, this.navigateToCart = false}) : super(key: key);

  @override
  _UnitFoundByQRCodeScreenState createState() => _UnitFoundByQRCodeScreenState();
}

class _UnitFoundByQRCodeScreenState extends State<UnitFoundByQRCodeScreen> {
  final GlobalKey<FlipCardState> _flipCardState = GlobalKey<FlipCardState>();

  @override
  void initState() {
    super.initState();

    print('*** _UnitFoundByQRCodeScreenState.initState()');
    getIt<UnitsBloc>().add(DetectLocationAndLoadUnits());
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Scaffold(
        backgroundColor: Colors.white,
        body: BlocListener<UnitsBloc, UnitsState>(
          listener: (BuildContext context, UnitsState state) {
            if (state is UnitsLoaded) {
              print('***************** UNITS LOADED=${state.units}');
              GeoUnit unit = state.units.firstWhere((unit) => unit.unitId == widget.unitId, orElse: () => null);
              if (unit != null) {
                unit.place = widget.place;
                // print('***************** UNITS FOUND=$unit');
                setPlacePref(widget.place);
                _flipCardState.currentState.toggleCard();
                showNotification(context, trans('selectUnit.tableReserved.title'), trans('selectUnit.tableReserved.description', [widget.place.table, widget.place.seat]), null);
                getIt<UnitSelectBloc>().add(SelectUnit(unit));
                getIt<CartBloc>().add(UpdatePlaceInCartAction(unit));
                Future.delayed(Duration(
                  milliseconds: 1000,
                )).then((value) => Nav.reset(MainNavigation(
                  pageIndex: widget.navigateToCart ? 4 : 0,
                )));
              } else {
                showErrorDialog(context, trans('selectUnit.qrCodeError.title'), trans('selectUnit.qrCodeError.description'), () => 
                Nav.reset(SelectUnitChooseMethodScreen()));
              }
            }
            if (state is UnitsNotLoaded) {
                //showErrorDialog(context, trans('selectUnit.qrUnitsError.title'), trans('selectUnit.qrUnitsError.description'), () => 
                showErrorDialog(context, state.reasonCode, state.reasonMessage, () => 
                Nav.reset(SelectUnitChooseMethodScreen()));

            }
            if (state is UnitsNoNearUnit) {
                showErrorDialog(context, trans('selectUnit.qrGeneralError.title'), trans('selectUnit.qrGeneralError.description'), () => 
                Nav.reset(SelectUnitChooseMethodScreen()));

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
                  style: GoogleFonts.poppins(
                    fontSize: 16.0,
                    fontWeight: FontWeight.w600,
                    color: Color(0xFF3C2F2F),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.only(top: 8.0),
                  child: CenterLoadingWidget(
                    color: theme.highlight,
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
              style: GoogleFonts.poppins(
                fontSize: 14.0,
                fontWeight: FontWeight.w400,
                color: Color(0xFF3C2F2F),
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.only(bottom: 30.0),
            child: Text(
              trans('selectUnit.chair', [widget.place.seat, widget.place.table]),
              textAlign: TextAlign.center,
              style: GoogleFonts.poppins(
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
