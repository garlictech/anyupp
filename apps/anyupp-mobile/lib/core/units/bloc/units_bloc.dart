import 'dart:async';

import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:fa_prev/core/units/units.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/shared/location.dart';
import 'package:flutter/services.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:meta/meta.dart';

part 'units_event.dart';
part 'units_state.dart';

String geoFirePathToReference = "generated/unitsGeo";

class UnitsBloc extends Bloc<UnitsEvent, UnitsState> {
  final UnitRepository _unitRepository;
  final LocationRepository _locationService;

  UnitsBloc(this._unitRepository, this._locationService) : super(UnitsInitial());

  static const int radiusInMeter = 10000; // 10 Km

  @override
  Stream<UnitsState> mapEventToState(
    UnitsEvent event,
  ) async* {
    print('UnitsBloc.mapEventToState()=$event');
    if (event is LoadUnitsNearLocation) {
      yield* _mapLoadUnitsNearLocationToState(event.location);
    }

    if (event is DetectLocationAndLoadUnits) {
      yield* _mapDetectLocationAndLoadUnitsToState(event);
    }
  }

  Stream<UnitsState> _mapLoadUnitsNearLocationToState(LatLng location) async* {
    print('UnitsBloc._mapLoadUnitsNearLocationToState $location');

    yield UnitsLoading();
    try {
      yield* _findNearestLoactions(location);
    } on PlatformException catch (e) {
      yield UnitsNotLoaded(
        reasonCode: e.code,
        reasonMessage: e.message,
      );
    } on Exception catch (e) {
      yield UnitsNotLoaded(
        reasonCode: 'ERROR_UNITS_UNKNOWN',
        reasonMessage: e.toString(),
      );
    }
  }

  Stream<UnitsState> _mapDetectLocationAndLoadUnitsToState(DetectLocationAndLoadUnits event) async* {
    print('UnitsBloc._mapDetectLocationAndLoadUnitsToState().start');
    yield UnitsLoading();
    try {
      print('****** Start getting location');
      // --- Get device current location (ask permissions if not granted)
      final LatLng location = await _locationService.getUserCurrentLocation();
      print('****** Current Location=$location');

      // --- Find locations
      yield* _findNearestLoactions(location);
    } on PlatformException catch (e) {
      yield UnitsNotLoaded(
        reasonCode: e.code,
        reasonMessage: e.message,
      );
    } on Exception catch (e) {
      yield UnitsNotLoaded(
        reasonCode: 'ERROR_UNITS_UNKNOWN',
        reasonMessage: e.toString(),
      );
    }
  }

  Stream<UnitsState> _findNearestLoactions(LatLng location) async* {
    print('UnitsBloc._findNearestLoactions().start()');
    try {
      final geoUnits = await _unitRepository.searchUnitsNearLocation(location, radiusInMeter);
      print('UnitsBloc._findNearestLoactions().units=$geoUnits');

      if (geoUnits == null || geoUnits.isEmpty) {
        yield UnitsNoNearUnit();
      } else {
        geoUnits.forEach((element) {
          print('\tunit[${element.id}]=${element.name}');
        });
        yield UnitsLoaded(geoUnits);
      }
    } on PlatformException catch (e) {
      yield UnitsNotLoaded(
        reasonCode: e.code,
        reasonMessage: e.message,
      );
    } on Exception catch (e) {
      yield UnitsNotLoaded(
        reasonCode: 'ERROR_UNITS_UNKNOWN',
        reasonMessage: e.toString(),
      );
    }
  }
}
