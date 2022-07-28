import 'package:equatable/equatable.dart';

class GeoLocation extends Equatable {
  const GeoLocation({
    required this.lat,
    required this.lon,
    required this.elevation,
  });

  final double lat;
  final double lon;
  final double elevation;

  @override
  List<Object?> get props => [
        lat,
        lon,
      ];
}
