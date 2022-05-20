import 'dart:async';

import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/shared/location.dart';
import 'package:flutter/services.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';

part 'units_event.dart';
part 'units_state.dart';

String geoFirePathToReference = "generated/unitsGeo";

class UnitsBloc extends Bloc<UnitsEvent, UnitsState> {
  final UnitRepository _unitRepository;
  final LocationRepository _locationService;
  static const int radiusInMeter = 10000; // 10 Km

  UnitsBloc(this._unitRepository, this._locationService)
      : super(UnitsInitial()) {
    on<LoadUnitsNearLocation>(_onLoadUnitsNearLocation);
    on<DetectLocationAndLoadUnits>(_onDetectLocationAndLoadUnits);
  }

  FutureOr<void> _onLoadUnitsNearLocation(
      LoadUnitsNearLocation event, Emitter<UnitsState> emit) async {
    emit(UnitsLoading());
    try {
      final geoUnits = await _unitRepository.searchUnitsNearLocation(
        event.location,
        radiusInMeter,
      );
      if (geoUnits.isEmpty) {
        emit(UnitsNoNearUnit());
      } else {
        emit(UnitsLoaded(geoUnits));
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
      final LatLng? location = await _locationService.getUserCurrentLocation();
      log.d('****** Current Location=$location');
      if (location == null) {
        emit(UnitsNotLoaded(
          reasonCode: 'ERROR_LOCATION_NOT_FOUND',
          reasonMessage: 'Cannot access location of the user\'s device',
        ));
      } else {
        final geoUnits = await _unitRepository.searchUnitsNearLocation(
          location,
          radiusInMeter,
        );
        if (geoUnits.isEmpty) {
          emit(UnitsNoNearUnit());
        } else {
          emit(UnitsLoaded(geoUnits));
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
}
