import 'package:custom_map_markers/custom_map_markers.dart';
import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/graphql/generated/crud-api.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/cart/cart.dart';
import 'package:fa_prev/modules/selectunit/selectunit.dart';
import 'package:fa_prev/modules/takeaway/takeaway.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/shared/widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:pull_to_refresh/pull_to_refresh.dart';

class SelectUnitMapScreen extends StatefulWidget {
  @override
  _SelectUnitMapScreenState createState() => _SelectUnitMapScreenState();
}

class _SelectUnitMapScreenState extends State<SelectUnitMapScreen> {
  RefreshController _refreshController = RefreshController(
    initialRefresh: false,
  );
  late GoogleMapController _mapController;
  MarkerData? _userMarker;

  final LatLng _center = const LatLng(47.4744579, 19.0754983);
  final theme = ThemeAnyUpp();

  @override
  void initState() {
    super.initState();
  }

  @override
  void dispose() {
    _mapController.dispose();
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
    return Scaffold(
      backgroundColor: theme.secondary12,
      extendBodyBehindAppBar: true,
      body: Stack(
        alignment: Alignment.center,
        children: [
          BlocBuilder<UnitsBloc, UnitsState>(
            builder: (context, state) {
              // log.e('SelectUnitMapScreen.UnitsBloc.state=$state');
              if (state is UnitsNoNearUnit) {
                return _getRefreshableMessage('selectUnitMap.noNearUnits');
              }

              if (state is UnitsNotLoaded) {
                return _getRefreshableMessage('selectUnitMap.notLoaded');
              }

              if (state is UnitsLoaded) {
                var units =
                    state.units.where((unit) => unit.isVisibleInApp).toList();

                if (units.isNotEmpty != true) {
                  return _getRefreshableMessage('selectUnitMap.noNearUnits');
                }

                var markers =
                    _createMarkers(units, state.userLocation).values.toList();
                if (_userMarker != null) {
                  markers.add(_userMarker!);
                }

                return Stack(
                  alignment: Alignment.center,
                  children: [
                    // --- GOOGLE MAPS
                    CustomGoogleMapMarkerBuilder(
                        customMarkers: markers,
                        builder: (BuildContext context, Set<Marker>? m) {
                          if (m == null) {
                            return CenterLoadingWidget(
                              strokeWidth: 2,
                            );
                          }

                          return GoogleMap(
                            onMapCreated: (controller) =>
                                _mapController = controller,
                            compassEnabled: true,
                            myLocationButtonEnabled: true,
                            mapToolbarEnabled: true,
                            mapType: MapType.normal,
                            zoomControlsEnabled: false,
                            initialCameraPosition: CameraPosition(
                              target: state.userLocation ?? _center,
                              // target: LatLng(47.4737, 19.0750),
                              zoom: 11.0,
                            ),
                            markers: m,
                          );
                        }),

                    // Unit list
                    Positioned(
                      bottom: 25.0,
                      left: 0.0,
                      right: 0.0,
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          // _buildUnitList(units, markers.toList()),
                          _MapUnitListWidget(
                            units: units,
                            markers: markers.toList(),
                            onPageChanged: (index) => _zoomToUnit(
                                units[index], markers[index].marker.markerId),
                          ),
                          Container(
                            // height: 100,
                            decoration: BoxDecoration(
                              boxShadow: [
                                BoxShadow(
                                  color: theme.secondary12,
                                  offset: Offset(0.0, 6.0),
                                  blurRadius: 8.0,
                                ),
                              ],
                              color: Colors.transparent,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                );
              }

              return CenterLoadingWidget(
                backgroundColor: theme.secondary0,
                color: theme.primary,
              );
            },
          ),
          // Takeaway mode switcher,
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
              return TakeAwayToggle(
                inPlace: mode == ServingMode.takeAway,
                showText: true,
                height: 40.0,
                backgroundColor: Colors.white,
                // colorTheme: theme,
                onToggle: (bool isLeft) {
                  var servingMode =
                      isLeft ? ServingMode.takeAway : ServingMode.inPlace;
                  getIt<TakeAwayBloc>().add(
                    SetServingMode(servingMode),
                  );
                  getIt<UnitsBloc>().add(
                    FilterUnits(servingMode: servingMode),
                  );
                  return true;
                },
              );
            }),
          ),
        ],
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

  Future<void> _zoomToUnit(GeoUnit unit, MarkerId markerId) async {
    log.d('_zoomToUnit()=${unit.loc}');
    return _animateMapToLocation(
      LatLng(
        unit.loc.lat,
        unit.loc.lng,
      ),
      markerId,
    );
  }

  Future<void> _animateMapToLocation(LatLng location, MarkerId markerId) async {
    var position = CameraPosition(
        // bearing: 192.8334901395799,
        target: location,
        // tilt: 59.440717697143555,
        zoom: 14.0);

    if (mounted) {
      await _mapController
          .animateCamera(CameraUpdate.newCameraPosition(position));
      // await _mapController.showMarkerInfoWindow(markerId);
    }
  }

  Map<MarkerId, MarkerData> _createMarkers(
      List<GeoUnit> units, LatLng? userLocation) {
    Map<MarkerId, MarkerData> unitMarkers = <MarkerId, MarkerData>{};
    if (userLocation != null) {
      var userMarker = MarkerData(
        marker: Marker(
          markerId: const MarkerId('USER'),
          position: userLocation, // LatLng(47.4737, 19.0750)
        ),
        child: _MarkerWidget(
          title: trans('selectUnit.you'),
          backgroundColor: Color(0xFFE74C3C),
          iconUrl: 'assets/icons/user_location_on_map.svg',
          iconBckgroundColor: theme.secondary0,
          iconColor: theme.secondary,
          textColor: theme.secondary0,
        ),
      );
      unitMarkers[userMarker.marker.markerId] = userMarker;
    }
    for (GeoUnit unit in units) {
      final MarkerId markerId = MarkerId(unit.id);

      unitMarkers[markerId] = MarkerData(
        child: _MarkerWidget(
          title: unit.name.toTitleCase(),
          backgroundColor: theme.primary,
          iconBckgroundColor: theme.secondary0,
          iconUrl: 'assets/icons/restaurant_menu_black.svg',
          iconColor: theme.secondary,
          textColor: theme.secondary0,
        ),
        marker: Marker(
          markerId: markerId,
          position: LatLng(
            unit.loc.lat,
            unit.loc.lng,
          ),
          onTap: () => selectUnitAndGoToMenuScreen(
            context,
            unit,
            deletePlace: true,
            useTheme: false,
            showSelectServingMode: false,
          ),
        ),
      );
    }

    // log.e('UnitMapWidget._createUnitsMarker().length=${unitMarkers.length}');
    return unitMarkers;
  }
}

class _MarkerWidget extends StatelessWidget {
  final String title;
  final Color backgroundColor;
  final Color textColor;
  final Color iconColor;
  final Color iconBckgroundColor;
  final String iconUrl;

  const _MarkerWidget({
    Key? key,
    required this.title,
    required this.backgroundColor,
    required this.textColor,
    required this.iconColor,
    required this.iconBckgroundColor,
    required this.iconUrl,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      mainAxisAlignment: MainAxisAlignment.center,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        Container(
          padding: const EdgeInsets.only(
            top: 5.0,
            bottom: 5.0,
            left: 5.0,
            right: 8.0,
          ),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(
              30.0,
            ),
            color: backgroundColor,
          ),
          child: Row(
            children: [
              Container(
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(
                    14.0,
                  ),
                  color: iconBckgroundColor,
                ),
                child: SvgPicture.asset(
                  iconUrl,
                  color: iconColor,
                  width: 20.0,
                  height: 20.0,
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
        SvgPicture.asset(
          'assets/icons/black_triangle.svg',
          color: backgroundColor,
          width: 16.0,
          height: 8.0,
        )
      ],
    );
  }
}

class _MapUnitListWidget extends StatelessWidget {
  final List<GeoUnit> units;
  final List<MarkerData> markers;
  final ValueChanged<int> onPageChanged;
  const _MapUnitListWidget({
    Key? key,
    required this.units,
    required this.markers,
    required this.onPageChanged,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      // you may want to use an aspect ratio here for tablet support
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
              image: unit.hasBanner ? unit.coverBanners?.first.imageUrl : null,
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
    );
  }
}
