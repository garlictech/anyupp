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
      _units = await _unitRepository.searchUnitsNearRadius(
        event.location,
        radiusInMeter,
      );
      var filteredUnits = _filter(_units ?? [], event.filter);
      if (filteredUnits.isEmpty) {
        emit(UnitsNoNearUnit());
      } else {
        emit(UnitsLoaded(units: filteredUnits, userLocation: _userLocation));
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
      _userLocation = LatLng(47.003841, 19.053478); // TODO kiszedni!
      log.d('****** Current Location=$_userLocation');
      if (_userLocation == null) {
        emit(UnitsNotLoaded(
          reasonCode: 'ERROR_LOCATION_NOT_FOUND',
          reasonMessage: 'Cannot access location of the user\'s device',
        ));
      } else {
        _units = await _unitRepository.searchUnitsNearRadius(
          _userLocation!,
          radiusInMeter,
        );
        var filteredUnits = _filter(_units ?? [], event.filter);
        filteredUnits.sort((a, b) => a.distance - b.distance);
        if (filteredUnits.isEmpty) {
          emit(UnitsNoNearUnit());
        } else {
          emit(UnitsLoaded(units: filteredUnits, userLocation: _userLocation));
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
    var filteredUnits = _filter(_units ?? [], event.filter);
    await Future.delayed(Duration(milliseconds: 300));
    log.d(
        '_onFilterUnits[${event.filter?.servingMode}]=${_units?.length}, filtered=${filteredUnits.length}');
    emit(UnitsLoaded(
      units: filteredUnits,
      userLocation: _userLocation,
    ));
  }

  List<GeoUnit> _filter(List<GeoUnit> units, UnitFilter? filter) {
    if (filter == null) {
      return units;
    }

    if (filter.servingMode != null) {
      var filteredUnits = units
          .where(
              (unit) => unit.supportedServingModes.contains(filter.servingMode))
          .toList();
      return filteredUnits;
    }

    return units;
  }
}
