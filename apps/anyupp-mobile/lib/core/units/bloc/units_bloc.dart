import 'dart:async';

import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:fa_prev/core/units/units.dart';
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

  // @override
  // Stream<UnitsState> mapEventToState(
  //   UnitsEvent event,
  // ) async* {
  //   print('UnitsBloc.mapEventToState()=$event');
  //   if (event is LoadUnitsNearLocation) {
  //     yield* _mapLoadUnitsNearLocationToState(event.location);
  //   }

  //   if (event is DetectLocationAndLoadUnits) {
  //     yield* _mapDetectLocationAndLoadUnitsToState(event);
  //   }
  // }

  // Stream<UnitsState> _mapLoadUnitsNearLocationToState(LatLng location) async* {
  //   print('UnitsBloc._mapLoadUnitsNearLocationToState $location');

  //   yield UnitsLoading();
  //   try {
  //     yield* _findNearestLoactions(location);
  //   } on PlatformException catch (e) {
  //     yield UnitsNotLoaded(
  //       reasonCode: e.code,
  //       reasonMessage: e.message,
  //     );
  //   } on Exception catch (e) {
  //     yield UnitsNotLoaded(
  //       reasonCode: 'ERROR_UNITS_UNKNOWN',
  //       reasonMessage: e.toString(),
  //     );
  //   }
  // }

  // Stream<UnitsState> _mapDetectLocationAndLoadUnitsToState(
  //     DetectLocationAndLoadUnits event) async* {
  //   print('UnitsBloc._mapDetectLocationAndLoadUnitsToState().start');
  //   yield UnitsLoading();
  //   try {
  //     print('****** Start getting location');
  //     // --- Get device current location (ask permissions if not granted)
  //     final LatLng? location = await _locationService.getUserCurrentLocation();
  //     print('****** Current Location=$location');
  //     if (location == null) {
  //       yield UnitsNotLoaded(
  //         reasonCode: 'ERROR_LOCATION_NOT_FOUND',
  //         reasonMessage: 'Cannot access location of the user\'s device',
  //       );
  //     } else {
  //       // --- Find locations
  //       yield* _findNearestLoactions(location);
  //     }
  //   } on PlatformException catch (e) {
  //     yield UnitsNotLoaded(
  //       reasonCode: e.code,
  //       reasonMessage: e.message,
  //     );
  //   } on Exception catch (e) {
  //     yield UnitsNotLoaded(
  //       reasonCode: 'ERROR_UNITS_UNKNOWN',
  //       reasonMessage: e.toString(),
  //     );
  //   }
  // }

  // Stream<UnitsState> _findNearestLoactions(LatLng location) async* {
  //   print('UnitsBloc._findNearestLoactions().start()');
  //   try {
  //     final geoUnits = await _unitRepository.searchUnitsNearLocation(
  //         location, radiusInMeter);
  //     print('UnitsBloc._findNearestLoactions().units=$geoUnits');

  //     if (geoUnits.isEmpty) {
  //       yield UnitsNoNearUnit();
  //     } else {
  //       yield UnitsLoaded(geoUnits);
  //     }
  //   } on PlatformException catch (e) {
  //     yield UnitsNotLoaded(
  //       reasonCode: e.code,
  //       reasonMessage: e.message,
  //     );
  //   } on Exception catch (e) {
  //     yield UnitsNotLoaded(
  //       reasonCode: 'ERROR_UNITS_UNKNOWN',
  //       reasonMessage: e.toString(),
  //     );
  //   }
  // }

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
      print('****** Start getting location');
      // --- Get device current location (ask permissions if not granted)
      final LatLng? location = await _locationService.getUserCurrentLocation();
      print('****** Current Location=$location');
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
