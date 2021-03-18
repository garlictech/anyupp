import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/core/theme/theme.dart';
import 'package:fa_prev/core/units/units.dart';
import 'package:fa_prev/modules/cart/cart.dart';
import 'package:fa_prev/shared/connectivity.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/modules/screens.dart';
import 'package:fa_prev/shared/location.dart';
import 'package:fa_prev/shared/nav.dart';
import 'package:fa_prev/shared/widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';

class SelectUnitByLocationScreen extends StatefulWidget {
  @override
  _SelectUnitByLocationScreenState createState() => _SelectUnitByLocationScreenState();
}

class _SelectUnitByLocationScreenState extends State<SelectUnitByLocationScreen> {
  GoogleMapController _mapController;
  Map<MarkerId, Marker> _unitMarkers = <MarkerId, Marker>{};
  Marker _userMarker = Marker(markerId: MarkerId('USER'));

  final LatLng _center = const LatLng(47.4744579, 19.0754983);

  _SelectUnitByLocationScreenState() : super();

  @override
  Widget build(BuildContext context) {
    return NetworkConnectionWrapperWidget(
      child: BlocListener<UnitsBloc, UnitsState>(
        listener: (BuildContext context, UnitsState state) {
          if (state is UnitsLoaded) {
            _createUnitsMarker(state.units);
          }
        },
        child: SafeArea(
          child: Scaffold(
            backgroundColor: Colors.white,
            extendBodyBehindAppBar: true,
            appBar: AppBar(
              // Custom Back Button
              leading: Container(
                padding: EdgeInsets.only(
                  left: 8.0,
                  top: 4.0,
                  bottom: 4.0,
                ),
                child: Container(
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(
                      width: 1,
                      color: theme.highlight.withOpacity(0.2), // Color(0x33857C18),
                    ),
                    color: theme.background, // Colors.white,
                  ),
                  child: BackButton(
                    color: theme.highlight,
                  ),
                ),
              ),
              elevation: 0.0,
              iconTheme: IconThemeData(
                color: theme.highlight, //change your color here
              ),
              backgroundColor: Colors.transparent,
            ),
            body: _buildContent(theme),
          ),
        ),
      ),
    );
  }

  Stack _buildContent(ThemeChainData theme) {
    return Stack(
      children: [
        // --- GOOGLE MAPS
        GoogleMap(
          onMapCreated: _onMapCreated,
          initialCameraPosition: CameraPosition(
            target: _center,
            zoom: 11.0,
          ),
          markers: Set<Marker>.of([..._unitMarkers.values, _userMarker]),
        ),

        // --- BOTTOM SHEET
        DraggableScrollableSheet(
          initialChildSize: 0.25,
          minChildSize: 0.25,
          maxChildSize: 0.9,
          builder: (BuildContext context, ScrollController scrollController) {
            return Stack(overflow: Overflow.visible, fit: StackFit.expand, children: [
              Container(
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.only(
                      topLeft: Radius.circular(20.0),
                      topRight: Radius.circular(20.0),
                    ),
                    color: theme.background,
                  ),
                  child: _buildUnitList(scrollController)),
              Positioned(
                top: 15,
                right: 15,
                child: Container(
                  width: 44.0,
                  height: 44.0,
                  child: FittedBox(
                    child: FloatingActionButton(
                      onPressed: () {
                        _determineUserPositionAndLoadUnits();
                      },
                      child: Icon(
                        Icons.my_location,
                        size: 32.0,
                      ),
                      foregroundColor: theme.highlight, //Color(0xFF857C18),
                      shape: CircleBorder(
                        side: BorderSide(
                          color: theme.highlight.withOpacity(0.2), //Color(0xFFE7E5D0),
                          width: 1.0,
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ]);
          },
        ),
      ],
    );
  }

  Widget _buildUnitList(ScrollController scrollController) {
    return Stack(
      children: [
        // Bottom sheet top 'icon'
        Container(
          padding: EdgeInsets.only(
            top: 8.0,
          ),
          child: Align(
            alignment: Alignment.topCenter,
            child: SizedBox(
              width: 60.0,
              height: 8.0,
              child: Container(
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.all(
                    Radius.circular(3.0),
                  ),
                  color: Color(0xFFD0D0D0),
                ),
              ),
            ),
          ),
        ),
        Container(
          padding: EdgeInsets.only(
            top: 20.0,
          ),
          child: Align(
            alignment: Alignment.topCenter,
            // UNITS_BLOC
            child: BlocBuilder<UnitsBloc, UnitsState>(builder: (context, state) {
              if (state is UnitsNoNearUnit) {
                return Text(trans('selectUnitMap.noNearUnits'));
              }
              if (state is UnitsNotLoaded) {
                return Text(trans('selectUnitMap.notLoaded'));
              }
              if (state is UnitsLoaded) {
                return ListView.builder(
                  padding: EdgeInsets.all(0.0),
                  itemCount: state.units.length,
                  physics: BouncingScrollPhysics(),
                  controller: scrollController,
                  itemBuilder: (context, index) {
                    return _buildUnitCardItem(context, state.units[index], index == 0);
                  },
                );
              }
              return CenterLoadingWidget(color: Color(0xFF857C18));
            }),
          ),
        ),
      ],
    );
  }

  Widget _buildUnitCardItem(BuildContext context, GeoUnit unit, bool highlight) {
    return InkWell(
      onTap: () => _selectUnitAndGoToMenuScreen(context, unit),
      child: Container(
        margin: EdgeInsets.only(
          left: 14.0,
          right: 14.0,
          bottom: 5.0,
          top: 5.0,
        ),
        padding: EdgeInsets.only(
          left: 20.0,
          right: 20.0,
          top: 20.0,
          bottom: 20.0,
        ),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(14.0),
          border: Border.all(
            width: 1.5,
            color: theme.border, //const Color(0xffe7e5d0),
          ),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Wrap(children: [
              if (unit.style?.images?.logo != null)
                Padding(
                  padding: const EdgeInsets.only(right: 8.0),
                  child: ImageWidget(
                    width: 32,
                    height: 40,
                    url: unit.style.images.logo,
                    placeholder: CircularProgressIndicator(),
                    errorWidget: Icon(Icons.error),
                    fit: BoxFit.cover,
                  ),
                ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    unit.name,
                    style: GoogleFonts.poppins(
                      fontSize: 18,
                      color: theme.text, //const Color(0xff3c2f2f),
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                  Text(
                    unit.address.toAddressString(),
                    style: GoogleFonts.poppins(
                      fontSize: 14,
                      color: theme.text, //const Color(0xff3c2f2f),
                    ),
                  ),
                ],
              ),
            ]),
            Padding(
              padding: const EdgeInsets.only(
                top: 18.0,
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Container(
                    padding: const EdgeInsets.only(
                      top: 4.0,
                      bottom: 4.0,
                      left: 8.0,
                      right: 8.0,
                    ),
                    height: 28.0,
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(6.0),
                      color: highlight
                          ? theme.indicator
                          : theme.highlight, //const Color(0xFF1E6F4A) : const Color(0xff857c18),
                    ),
                    child: Center(
                      child: Text(
                        (unit.distance / 1000).toStringAsFixed(3) + ' km',
                        style: GoogleFonts.poppins(
                          fontSize: 14,
                          color: theme.text2, //const Color(0xffffffff),
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ),
                  ),
                  Text(
                    unit.openingHours,
                    style: GoogleFonts.poppins(
                      fontSize: 14,
                      color: theme.text, //const Color(0xff3c2f2f),
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ),
            )
          ],
        ),
      ),
    );
  }

  void _onMapCreated(GoogleMapController controller) {
    _mapController = controller;
    // getIt<UnitsBloc>().add(DetectLocationAndLoadUnits());
    _determineUserPositionAndLoadUnits();
  }

  void _determineUserPositionAndLoadUnits() async {
    try {
      LatLng userLocation = await getIt<LocationRepository>().getUserCurrentLocation();
      print('_determineUserPositionAndLoadUnits().location=$userLocation');
      _animateMapToLocation(userLocation);
      _loadNearUnits(userLocation);
    } on Exception {
      _showLocationPermissionRejectedAlertDialog(context);
    }
  }

  Future<void> _animateMapToLocation(LatLng userCurrentLocation) async {
    var position = CameraPosition(
        // bearing: 192.8334901395799,
        target: userCurrentLocation,
        // tilt: 59.440717697143555,
        zoom: 14.0);

    _createUserMarker(
      userCurrentLocation,
      trans('selectUnitMap.userMarker.title'),
      trans('selectUnitMap.userMarker.description'),
    );
    if (mounted) {
      _mapController.animateCamera(CameraUpdate.newCameraPosition(position));
    }
  }

  void _loadNearUnits(LatLng userCurrentLocation) {
    getIt<UnitsBloc>().add(LoadUnitsNearLocation(userCurrentLocation));
  }

  void _selectUnitAndGoToMenuScreen(BuildContext context, GeoUnit unit) {
    getIt<UnitSelectBloc>().add(SelectUnit(unit));
    getIt<CartBloc>().add(ClearPlaceInCart(unit));
    Nav.reset(MainNavigation());
  }

  void _createUserMarker(LatLng location, String title, String snippets) {
    final MarkerId markerId = MarkerId('USER');
    final Marker marker = Marker(
      markerId: markerId,
      position: location,
      infoWindow: InfoWindow(title: title, snippet: snippets),
    );

    setState(() {
      // adding a new marker to map
      _userMarker = marker;
    });
  }

  void _createUnitsMarker(List<GeoUnit> units) {
    Map<MarkerId, Marker> unitMarkers = <MarkerId, Marker>{};

    units.forEach((unit) {
      final MarkerId markerId = MarkerId(unit.unitId);

      unitMarkers[markerId] = Marker(
        markerId: markerId,
        icon: BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueGreen),
        position: unit.address.location,
        infoWindow: InfoWindow(title: unit.name, snippet: unit.address.toAddressString()),
        onTap: () {
          // TODO _onMarkerTapped(markerId);
        },
      );
    });

    setState(() {
      // adding a new marker to map
      _unitMarkers = unitMarkers;
    });
  }

  Future<void> _showLocationPermissionRejectedAlertDialog(BuildContext context) async {
    return showDialog<void>(
      context: context,
      barrierDismissible: false, // user must tap button!
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text(trans('selectUnitMap.permission.title')),
          content: SingleChildScrollView(
            child: ListBody(
              children: <Widget>[
                Text(trans('selectUnitMap.permission.description')),
              ],
            ),
          ),
          actions: <Widget>[
            FlatButton(
              child: Text(trans('selectUnitMap.permission.closeApp')),
              onPressed: () {
                // Close this dialog
                Nav.pop();
                // Exit application
                SystemChannels.platform.invokeMethod('SystemNavigator.pop');
              },
            ),
            FlatButton(
              child: Text(trans('selectUnitMap.permission.backToMap')),
              onPressed: () {
                // Close this dialog
                Nav.pop();
                // Restart permission request
                _determineUserPositionAndLoadUnits();
              },
            ),
          ],
        );
      },
    );
  }
}
