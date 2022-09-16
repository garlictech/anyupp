import 'package:anyupp/device/repositories/geo-location-repository-impl.dart';
import 'package:anyupp/domain/repositories/geo-location-repository.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

final geoLocationRepositoryProvider =
    Provider<GeoLocationRepository>((ref) => GeoLocationRepositoryImpl());
