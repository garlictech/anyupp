import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/cart/cart.dart';
import 'package:fa_prev/modules/login/login.dart';
import 'package:fa_prev/shared/auth.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/modules/screens.dart';
import 'package:fa_prev/shared/nav.dart';
import 'package:fa_prev/shared/widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:google_fonts/google_fonts.dart';

import 'flutter_qr_code_scanner.dart';

class SelectUnitChooseMethodScreen extends StatefulWidget {
  @override
  _SelectUnitChooseMethodScreenState createState() => _SelectUnitChooseMethodScreenState();
}

class _SelectUnitChooseMethodScreenState extends State<SelectUnitChooseMethodScreen> {
  @override
  void initState() {
    super.initState();
    print('_SelectUnitChooseMethodScreenState.initState()');
    getIt<UnitsBloc>().add(DetectLocationAndLoadUnits());
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<User>(
        future: getIt<AuthRepository>().getAuthenticatedUserProfile(),
        builder: (BuildContext context, AsyncSnapshot<User> userSnapshot) {
          if (userSnapshot.hasData) {
            return buildPage(context, userSnapshot.data);
          }
          return CenterLoadingWidget();
        });
  }

  Widget buildPage(BuildContext context, User user) {
    return SafeArea(
      child: Scaffold(
        backgroundColor: Colors.white,
        body: SingleChildScrollView(
          physics: BouncingScrollPhysics(),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: <Widget>[
              _buildUserInfoRow(context, user),
              _buildPage(context),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildUserInfoRow(BuildContext context, User user) {
    return Padding(
      padding: const EdgeInsets.all(14.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.start,
        children: [
          if (user.profileImage != null)
            Container(
              width: 46.0,
              height: 46.0,
              decoration: BoxDecoration(
                color: Colors.black.withOpacity(0.7),
                image: DecorationImage(
                  image: NetworkImage(user.profileImage),
                  fit: BoxFit.cover,
                ),
                borderRadius: BorderRadius.all(
                  Radius.circular(10.0),
                ),
              ),
            ),
          if (user.profileImage == null)
            Container(
              width: 46.0,
              height: 46.0,
              decoration: BoxDecoration(
                color: Color(0xFF857C18),
                borderRadius: BorderRadius.all(
                  Radius.circular(10.0),
                ),
              ),
              child: Icon(
                Icons.perm_identity,
                size: 24.0,
                color: Colors.white.withOpacity(0.7),
              ),
            ),
          Padding(
            padding: const EdgeInsets.only(
              left: 12.0,
            ),
            child: Text(
              trans('selectUnit.welcome', [user.name != null ? user.name : trans('selectUnit.unknown')]),
              style: GoogleFonts.poppins(
                fontSize: 14.0,
                color: Color(0xFF3C2F2F),
              ),
            ),
          ),
          Expanded(
            child: Container(),
          ),
          Container(
            width: 46.0,
            height: 46.0,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(10),
              border: Border.all(
                width: 1.5,
                color: Color(0x33857C18),
              ),
            ),
            child: IconButton(
              icon: Icon(
                Icons.refresh,
                color: Colors.black,
              ),
              onPressed: () {
                // Nav.to(DataStoreDemoScreen());
                getIt<UnitsBloc>().add(DetectLocationAndLoadUnits());
              },
            ),
          ),
          Container(
            width: 46.0,
            height: 46.0,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(10),
              border: Border.all(
                width: 1.5,
                color: Color(0x33857C18),
              ),
            ),
            child: IconButton(
              icon: SvgPicture.asset(
                'assets/icons/login.svg',
                color: Colors.black,
                width: 22.0,
                height: 22.0,
              ),
              onPressed: () {
                // Nav.to(DataStoreDemoScreen());
                showConfirmLogoutDialog(context, true);
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPage(BuildContext context) {
    return SingleChildScrollView(
      child: Container(
        padding: EdgeInsets.all(15.0),
        child: Column(
          children: [
            // --- Scan QR Code card
            _buildQRCodeCard(context),
            // --- Nearest place list
            Container(
              width: double.infinity,
              padding: EdgeInsets.only(
                top: 35.0,
                bottom: 12.0,
              ),
              child: Text(
                trans('selectUnit.findNearest'),
                textAlign: TextAlign.start,
                style: GoogleFonts.poppins(
                  fontSize: 14.0,
                  fontWeight: FontWeight.w500,
                  color: const Color(0xFF3C2F2F),
                ),
              ),
            ),
            _buildUnitListBloc(context),

            // --- Bottom button ('Check them all on the map')
            Container(
              width: double.infinity,
              height: 52.0,
              margin: EdgeInsets.only(top: 16.0),
              child: TextButton(
                style: TextButton.styleFrom(
                  backgroundColor: Color(0xFFF3F2E7),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12.0),
                  ),
                ),
                onPressed: () => Nav.to(SelectUnitByLocationScreen()),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      trans('selectUnit.checkAllOnMap'),
                      style: GoogleFonts.poppins(
                        fontSize: 14,
                        color: Color(0xFF3C2F2F),
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    Icon(Icons.navigate_next),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildQRCodeCard(BuildContext context) {
    final ThemeChainData theme = getIt<ThemeBloc>().state.theme;

    return InkWell(
      highlightColor: theme.indicator.withAlpha(128),
      hoverColor: theme.indicator.withAlpha(128),
      onTap: () => Nav.to(QRCodeScannerScreen()),
      // onTap: () => navigateTo(
      //             context,
      //             (_, __, ___) => UnitFoundByQRCodeScreen(
      //                   place: Place('1', '2'),
      //                   unitId: '-MGMw7p0gQsX31ZLZOkK',
      //                   navigateToCart: false,
      //                 )),
      child: Container(
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
              child: SvgPicture.asset('assets/icons/qr-scan.svg'),
            ),
            Padding(
              padding: const EdgeInsets.only(top: 25.0, bottom: 30.0),
              child: Text(
                trans('selectUnit.scanQR'),
                textAlign: TextAlign.center,
                style: GoogleFonts.poppins(
                  fontSize: 16.0,
                  fontWeight: FontWeight.w600,
                  color: Color(0xFF3C2F2F),
                ),
              ),
            )
          ],
        ),
      ),
    );
  }

  Widget _buildUnitListBloc(BuildContext context) {
    // print('*********** _buildUnitListBloc()');
    return BlocBuilder<UnitsBloc, UnitsState>(builder: (context, state) {
      // print('*********** _buildUnitListBloc().BlocBuilder.state=$state');
      if (state is UnitsNoNearUnit) {
        return Container(
          padding: EdgeInsets.all(0.0),
          height: 138,
          child: Center(child: Text(trans('selectUnitMap.noNearUnits'))),
        );
      }
      if (state is UnitsNotLoaded) {
        return Container(
          padding: EdgeInsets.all(0.0),
          height: 138,
          child: Center(child: Text(trans('selectUnitMap.notLoaded'))),
        );
      }
      if (state is UnitsLoaded) {
        return _buildUnitList(context, state.units);
      }
      return Container(
        padding: EdgeInsets.all(0.0),
        height: 138,
        child: CenterLoadingWidget(color: Color(0xFF857C18)),
      );
    });
  }

// TODO: couldn't be the select_unit_map.dart/_buildUnitCardItem used?
  Widget _buildUnitList(BuildContext context, List<GeoUnit> units) {
    return Container(
      padding: EdgeInsets.all(0.0),
      height: 138,
      child: ListView.builder(
        itemCount: units.length,
        scrollDirection: Axis.horizontal,
        physics: BouncingScrollPhysics(),
        itemBuilder: (context, index) {
          return InkWell(
            onTap: () => _selectUnitAndGoToMenuScreen(context, units[index]),
            child: Container(
              width: MediaQuery.of(context).size.width / (3 / 2),
              margin: EdgeInsets.only(
                left: 4.0,
                right: 4.0,
              ),
              padding: EdgeInsets.only(
                top: 22.0,
                bottom: 10.0,
                left: 18.0,
                right: 18.0,
              ),
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(12.0),
                border: Border.all(
                  width: 1.5,
                  color: Color(0xFFE7E5D0),
                ),
              ),
              child: Container(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      units[index].name,
                      maxLines: 2,
                      style: GoogleFonts.poppins(
                        fontSize: 14.0,
                        fontWeight: FontWeight.w600,
                        color: Color(0xFF3C2F2F),
                      ),
                    ),
                    Text(
                      units[index].address?.address ?? '',
                      maxLines: 2,
                      style: GoogleFonts.poppins(
                        fontSize: 12.0,
                        fontWeight: FontWeight.w400,
                        color: Color(0xFF3C2F2F),
                      ),
                    ),
                    Expanded(
                      child: Container(),
                    ),
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.only(
                            top: 4.0,
                            bottom: 4.0,
                            left: 8.0,
                            right: 8.0,
                          ),
                          margin: EdgeInsets.only(top: 10.0),
                          height: 25.0,
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(6.0),
                            color: const Color(0xFF30BF60),
                          ),
                          child: Center(
                            child: Text(
                              (units[index].distance ?? 0 / 1000).toStringAsFixed(3) + ' km',
                              style: GoogleFonts.poppins(
                                fontSize: 12,
                                color: const Color(0xffffffff),
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  void _selectUnitAndGoToMenuScreen(BuildContext context, GeoUnit unit) {
    // unit.place = Place('00', '00');
    getIt<CartBloc>().add(ClearPlaceInCart(unit));
    getIt<UnitSelectBloc>().add(SelectUnit(unit));
    Nav.reset(MainNavigation());
  }
}
