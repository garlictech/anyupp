import 'dart:async';

import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/graphql/generated/crud-api.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/shared/location.dart';
import 'package:flutter/services.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';

part 'units_event.dart';
part 'units_state.dart';

class UnitsBloc extends Bloc<UnitsEvent, UnitsState> {
  final UnitRepository _unitRepository;
  final LocationRepository _locationService;
  static const int radiusInMeter = 10000; // 10 Km

  UnitsBloc(this._unitRepository, this._locationService)
      : super(UnitsInitial()) {
    on<LoadUnitsNearLocation>(_onLoadUnitsNearLocation);
    on<DetectLocationAndLoadUnits>(_onDetectLocationAndLoadUnits);
    on<FilterUnits>(_onFilterUnits);
  }

  List<GeoUnit>? _units;
  LatLng? _userLocation;

  FutureOr<void> _onLoadUnitsNearLocation(
      LoadUnitsNearLocation event, Emitter<UnitsState> emit) async {
    emit(UnitsLoading());
    try {
      _userLocation = event.location;
      _units = await _unitRepository.searchUnitsNearLocation(
        event.location,
        radiusInMeter,
      );
      if (_units == null || _units?.isEmpty == true) {
        emit(UnitsNoNearUnit());
      } else {
        emit(UnitsLoaded(units: _units!, userLocation: _userLocation));
      }
    } on PlatformException catch (e) {
      emit(UnitsNotLoaded(
        reasonCode: e.code,
        reasonMessage: e.message,
      ));
    } on Exception catch (e) {
      emit(UnitsNotLoaded(
        reasonCode: 'ERROR_UNITS_UNKNOWN',
        reasonMessage: e.toString(),
      ));
    }
  }

  FutureOr<void> _onDetectLocationAndLoadUnits(
      DetectLocationAndLoadUnits event, Emitter<UnitsState> emit) async {
    emit(UnitsLoading());
    try {
      log.d('****** Start getting location');
      // --- Get device current location (ask permissions if not granted)
      _userLocation = await _locationService.getUserCurrentLocation();
      log.d('****** Current Location=$_userLocation');
      if (_userLocation == null) {
        emit(UnitsNotLoaded(
          reasonCode: 'ERROR_LOCATION_NOT_FOUND',
          reasonMessage: 'Cannot access location of the user\'s device',
        ));
      } else {
        _units = await _unitRepository.searchUnitsNearLocation(
          _userLocation!,
          radiusInMeter,
        );
        if (_units == null || _units?.isEmpty == true) {
          emit(UnitsNoNearUnit());
        } else {
          emit(UnitsLoaded(
            units: _units!,
            userLocation: _userLocation,
          ));
        }
      }
    } on PlatformException catch (e) {
      emit(UnitsNotLoaded(
        reasonCode: e.code,
        reasonMessage: e.message,
      ));
    } on Exception catch (e) {
      emit(UnitsNotLoaded(
        reasonCode: 'ERROR_UNITS_UNKNOWN',
        reasonMessage: e.toString(),
      ));
    }
  }

  FutureOr<void> _onFilterUnits(
      FilterUnits event, Emitter<UnitsState> emit) async {
    emit(UnitsLoading());
    var filteredUnits = _units
            ?.where((unit) =>
                unit.supportedServingModes.contains(event.servingMode))
            .toList() ??
        [];
    await Future.delayed(Duration(milliseconds: 300));
    log.d('_onFilterUnits=${_units?.length}, filtered=${filteredUnits.length}');
    emit(UnitsLoaded(
      units: filteredUnits,
      userLocation: _userLocation,
    ));
  }
}
