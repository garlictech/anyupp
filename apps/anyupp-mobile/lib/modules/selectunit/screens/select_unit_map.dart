import 'dart:async';

import 'package:bubble_box/bubble_box.dart';
import '/core/core.dart';
import '/graphql/generated/crud-api.dart';
import '/models.dart';
import '/modules/cart/cart.dart';
import '/modules/selectunit/selectunit.dart';
import '/modules/selectunit/utils/marker_generator.dart';
import '/modules/takeaway/takeaway.dart';
import '/shared/locale.dart';
import '/shared/widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:pull_to_refresh/pull_to_refresh.dart';

class SelectUnitMapScreen extends StatefulWidget {
  @override
  State<SelectUnitMapScreen> createState() => _SelectUnitMapScreenState();
}

class _SelectUnitMapScreenState extends State<SelectUnitMapScreen> {
  RefreshController _refreshController = RefreshController(
    initialRefresh: false,
  );

  @override
  void dispose() {
    _refreshController.dispose();
    super.dispose();
  }

  void _onRefresh() async {
    getIt<CartBloc>().add(ResetCartInMemory());
    getIt<UnitsBloc>().add(DetectLocationAndLoadUnits());
    _refreshController.refreshCompleted();
  }

  @override
  Widget build(BuildContext context) {
    return AnnotatedRegion<SystemUiOverlayStyle>(
      value: SystemUiOverlayStyle(
        statusBarColor: Colors.transparent,
      ),
      child: Scaffold(
        backgroundColor: theme.secondary12,
        body: Stack(
          alignment: Alignment.center,
          children: [
            BlocBuilder<UnitsBloc, UnitsState>(
              builder: (context, state) {
                if (state is UnitsNoNearUnit) {
                  return _getRefreshableMessage('selectUnitMap.noNearUnits');
                }

                if (state is UnitsNotLoaded) {
                  return _getRefreshableMessage('selectUnitMap.notLoaded');
                }

                if (state is UnitsLoaded) {
                  if (state.units.isNotEmpty != true) {
                    return _getRefreshableMessage('selectUnitMap.noNearUnits');
                  }

                  return SelectUnitMapScreenInner(
                    units: state.units,
                    userLocation: state.userLocation,
                  );
                }

                return CenterLoadingWidget(
                  backgroundColor: theme.secondary0,
                  color: theme.primary,
                );
              },
            ),
            // TakeAway
            Positioned(
              top: kToolbarHeight + 16.0,
              // alignment: Alignment.topCenter,
              child: BlocBuilder<TakeAwayBloc, TakeAwayState>(builder: (
                context,
                state,
              ) {
                var mode = ServingMode.inPlace;
                if (state is ServingModeSelectedState) {
                  mode = state.servingMode;
                }
                return PhysicalModel(
                  color: Colors.transparent,
                  shadowColor: theme.secondary.withOpacity(0.5),
                  borderRadius: BorderRadius.all(Radius.circular(32.0)),
                  shape: BoxShape.rectangle,
                  elevation: 8.0,
                  child: TakeAwayToggle(
                    initialMode: mode,
                    showText: true,
                    height: 40.0,
                    backgroundColor: Colors.white,
                    // colorTheme: theme,
                    onToggle: (ServingMode servingMode) async {
                      getIt<TakeAwayBloc>().add(
                        SetServingMode(servingMode),
                      );
                      getIt<UnitsBloc>().add(
                        FilterUnits(
                            filter: UnitFilter(
                          servingMode: servingMode,
                        )),
                      );
                      return true;
                    },
                  ),
                );
              }),
            ),
          ],
        ),
      ),
    );
  }

  Widget _getRefreshableMessage(String titleKey) {
    return SmartRefresher(
      enablePullDown: true,
      header: MaterialClassicHeader(),
      controller: _refreshController,
      onRefresh: _onRefresh,
      child: UnitLoadInfoWidget(
        titleKey: titleKey,
      ),
    );
  }
}

class SelectUnitMapScreenInner extends StatefulWidget {
  final List<Unit> units;
  final LatLng? userLocation;

  const SelectUnitMapScreenInner({
    Key? key,
    required this.units,
    this.userLocation,
  }) : super(key: key);

  @override
  _SelectUnitMapScreenInnerState createState() =>
      _SelectUnitMapScreenInnerState();
}

class _SelectUnitMapScreenInnerState extends State<SelectUnitMapScreenInner> {
  Completer<GoogleMapController> _mapController = Completer();
  Marker? _userMarker;
  Set<Marker> _markers = {};
  Unit? _selectedUnit;

  final LatLng _center = const LatLng(47.4744579, 19.0754983);

  @override
  void initState() {
    super.initState();
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _createMarkers(widget.units, widget.userLocation, _selectedUnit);
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      alignment: Alignment.center,
      children: [
        // --- GOOGLE MAPS
        GoogleMap(
          onMapCreated: (controller) {
            if (!_mapController.isCompleted) {
              _mapController.complete(controller);
            }
          },
          compassEnabled: true,
          myLocationButtonEnabled: false,
          mapToolbarEnabled: false,
          zoomControlsEnabled: false,
          mapType: MapType.normal,
          zoomGesturesEnabled: true,
          initialCameraPosition: CameraPosition(
            target: widget.userLocation ?? _center,
            zoom: 11.0,
          ),
          markers: _markers,
        ),

        // My location button
        Positioned(
          right: 16.0,
          child: FloatingActionButton.small(
            backgroundColor: theme.button,
            onPressed: () {
              if (_userMarker?.position != null) {
                _animateMapToLocation(
                  _userMarker!.position,
                );
              }
            },
            child: Icon(Icons.my_location),
          ),
        ),
        // Unit list
        Positioned(
          bottom: 25.0,
          left: 0.0,
          right: 0.0,
          child: _MapUnitListWidget(
            units: widget.units,
            onPageChanged: (index) =>
                _onPageChanged(index, widget.units[index]),
            // onPageChanged: (index) => _zoomToUnit(
            //     units[index], markers[index].marker.markerId),
          ),
        ),
      ],
    );
  }

  _onPageChanged(int index, Unit unit) {
    _zoomToUnit(unit);
    if (mounted) {
      setState(() {
        _selectedUnit = unit;
      });
    }
    _createMarkers(widget.units, widget.userLocation, _selectedUnit);
  }

  Future<void> _zoomToUnit(Unit unit) async {
    log.d('_zoomToUnit()=${unit.loc}');
    return _animateMapToLocation(
      LatLng(
        unit.loc.lat,
        unit.loc.lng,
      ),
    );
  }

  Future<void> _animateMapToLocation(LatLng location) async {
    var position = CameraPosition(
        // bearing: 192.8334901395799,
        target: location,
        // tilt: 59.440717697143555,
        zoom: 14.0);

    final GoogleMapController controller = await _mapController.future;
    if (mounted) {
      await controller.animateCamera(CameraUpdate.newCameraPosition(position));
      // await _mapController.showMarkerInfoWindow(markerId);
    }
  }

  Future<void> _createMarkers(
    List<Unit> units,
    LatLng? userLocation,
    Unit? selectedUnit,
  ) async {
    List<Widget> unitMarkers = [];

    if (userLocation != null) {
      var userMarker = _MarkerWidget(
        title: trans('selectUnit.you'),
        backgroundColor: Color(0xFFE74C3C),
        iconUrl: 'assets/icons/user_location_on_map.svg',
        iconBckgroundColor: theme.secondary0,
        iconColor: theme.secondary,
        textColor: theme.secondary0,
        iconSize: 20.0,
      );
      unitMarkers.add(userMarker);
    }
    for (Unit unit in units) {
      final isInplace =
          unit.supportedServingModes.contains(ServingMode.inPlace);

      unitMarkers.add(
        selectedUnit?.id == unit.id
            ? _MarkerWidget(
                title: unit.name.toTitleCase(),
                backgroundColor: theme.primary,
                iconBckgroundColor: theme.secondary0,
                iconUrl: isInplace
                    ? 'assets/icons/restaurant_menu_black.svg'
                    : 'assets/icons/bag.svg',
                iconColor: theme.secondary,
                textColor: theme.secondary0,
                iconSize: isInplace ? 20.0 : 16.0,
              )
            : _MarkerWidget(
                title: unit.name.toTitleCase(),
                textColor: theme.secondary,
                backgroundColor: theme.secondary0,
                iconColor: theme.secondary0,
                iconBckgroundColor: theme.primary,
                iconUrl: isInplace
                    ? 'assets/icons/restaurant_menu_black.svg'
                    : 'assets/icons/bag.svg',
                iconSize: isInplace ? 20.0 : 16.0,
                borderColor: theme.secondary40,
              ),
      );
    }
    MarkerGenerator(unitMarkers, (bitmaps) {
      // bitmaps.map((bm) => BitmapDescriptor.fromBytes(bm));
      List<Marker> markers = [];
      for (int i = 0; i < bitmaps.length; i++) {
        if (i == 0) {
          MarkerId id = MarkerId('USER');
          _userMarker = Marker(
            markerId: id,
            icon: BitmapDescriptor.fromBytes(bitmaps[i]),
            position: widget.userLocation ?? _center,
          );
          markers.add(_userMarker!);
        } else {
          MarkerId id = MarkerId(units[i - 1].id);
          markers.add(
            Marker(
              markerId: id,
              zIndex: selectedUnit?.id == units[i - 1].id ? 100 : 0,
              icon: BitmapDescriptor.fromBytes(bitmaps[i]),
              position: LatLng(
                units[i - 1].loc.lat,
                units[i - 1].loc.lng,
              ),
              onTap: () => selectUnitAndGoToMenuScreen(
                context,
                units[i],
                deletePlace: true,
                useTheme: false,
                showSelectServingMode: false,
              ),
            ),
          );
        }
        markers.sort(
          (a, b) => a.markerId.value == selectedUnit?.id ? 0 : 1,
        );
      }
      if (mounted) {
        setState(() {
          _markers = markers.toSet();
        });
      }
    }).generate(context);
  }
}

class _MarkerWidget extends StatelessWidget {
  final String title;
  final Color backgroundColor;
  final Color textColor;
  final Color iconColor;
  final Color iconBckgroundColor;
  final String iconUrl;
  final double iconSize;
  final Color? borderColor;

  const _MarkerWidget({
    Key? key,
    required this.title,
    required this.backgroundColor,
    required this.textColor,
    required this.iconColor,
    required this.iconBckgroundColor,
    required this.iconUrl,
    required this.iconSize,
    this.borderColor,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return BubbleBox(
      backgroundColor: backgroundColor,
      elevation: 0.0,
      // maxWidth: 100.0,
      padding: EdgeInsets.zero,
      shape: BubbleShapeBorder(
        direction: BubbleDirection.bottom,
        radius: const BorderRadius.all(Radius.circular(24.0)),
        border: borderColor != null
            ? BubbleBoxBorder(
                color: borderColor!,
                width: 2,
              )
            : null,
      ),
      child: Container(
        padding: const EdgeInsets.only(
          top: 5.0,
          bottom: 5.0,
          left: 5.0,
          right: 8.0,
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 24.0,
              height: 24.0,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(
                  14.0,
                ),
                color: iconBckgroundColor,
              ),
              child: Center(
                child: SvgPicture.asset(
                  iconUrl,
                  color: iconColor,
                  width: iconSize,
                  height: iconSize,
                ),
              ),
            ),
            SizedBox(
              width: 4.0,
            ),
            Text(
              title,
              style: Fonts.hH5(
                color: textColor,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _MapUnitListWidget extends StatelessWidget {
  final List<Unit> units;
  final ValueChanged<int> onPageChanged;
  const _MapUnitListWidget({
    Key? key,
    required this.units,
    required this.onPageChanged,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return PhysicalModel(
      color: Colors.transparent,
      shadowColor: theme.secondary.withOpacity(0.5),
      shape: BoxShape.rectangle,
      elevation: 10.0,
      child: SizedBox(
        height: 120.0,
        child: PageView.builder(
          controller: PageController(viewportFraction: 0.88),
          physics: BouncingScrollPhysics(),
          onPageChanged: (index) => onPageChanged(index),
          itemCount: units.length,
          itemBuilder: (BuildContext context, int index) {
            var unit = units[index];
            return Padding(
              padding: const EdgeInsets.only(
                left: 6.0,
                right: 6.0,
              ),
              child: UnitMapCardWidget(
                closeTime: getOpeningText(context, unit),
                height: 120.0,
                distance: '${(unit.distance / 1000).toStringAsFixed(0)}m',
                image:
                    unit.hasBanner ? unit.coverBanners?.first.imageUrl : null,
                // isFavorite: false,
                // unitFoodType: 'Casual',
                unitName: unit.name,
                // unitPriceType: '\$\$',
                // discount: 20,
                // rating: 4.8,
                onTap: () => selectUnitAndGoToMenuScreen(
                  context,
                  unit,
                  deletePlace: true,
                  useTheme: false,
                  showSelectServingMode: false,
                ),
              ),
            );
          },
        ),
      ),
    );
  }
}
