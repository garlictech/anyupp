import 'package:flutter/foundation.dart';

@immutable
class GeolocationData {
  final String status;
  final String? country;
  final String? countryCode;
  final String? region;
  final String? regionName;
  final String? city;
  final String? zip;
  final double lat;
  final double lon;
  final String? timezone;
  final String? isp;
  final String? org;
  final String? as;
  final String? query;
  GeolocationData({
    required this.status,
    this.country,
    this.countryCode,
    this.region,
    this.regionName,
    this.city,
    this.zip,
    required this.lat,
    required this.lon,
    this.timezone,
    this.isp,
    this.org,
    this.as,
    this.query,
  });

  GeolocationData copyWith({
    String? status,
    String? country,
    String? countryCode,
    String? region,
    String? regionName,
    String? city,
    String? zip,
    double? lat,
    double? lon,
    String? timezone,
    String? isp,
    String? org,
    String? as,
    String? query,
  }) {
    return GeolocationData(
      status: status ?? this.status,
      country: country ?? this.country,
      countryCode: countryCode ?? this.countryCode,
      region: region ?? this.region,
      regionName: regionName ?? this.regionName,
      city: city ?? this.city,
      zip: zip ?? this.zip,
      lat: lat ?? this.lat,
      lon: lon ?? this.lon,
      timezone: timezone ?? this.timezone,
      isp: isp ?? this.isp,
      org: org ?? this.org,
      as: as ?? this.as,
      query: query ?? this.query,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'status': status,
      'country': country,
      'countryCode': countryCode,
      'region': region,
      'regionName': regionName,
      'city': city,
      'zip': zip,
      'lat': lat,
      'lon': lon,
      'timezone': timezone,
      'isp': isp,
      'org': org,
      'as': as,
      'query': query,
    };
  }

  factory GeolocationData.fromJson(Map<String, dynamic> map) {
    return GeolocationData(
      status: map['status'],
      country: map['country'],
      countryCode: map['countryCode'],
      region: map['region'],
      regionName: map['regionName'],
      city: map['city'],
      zip: map['zip'],
      lat: map['lat'],
      lon: map['lon'],
      timezone: map['timezone'],
      isp: map['isp'],
      org: map['org'],
      as: map['as'],
      query: map['query'],
    );
  }

  @override
  String toString() {
    return 'GeolocationData(status: $status, country: $country, countryCode: $countryCode, region: $region, regionName: $regionName, city: $city, zip: $zip, lat: $lat, lon: $lon, timezone: $timezone, isp: $isp, org: $org, as: $as, query: $query)';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;

    return other is GeolocationData &&
        other.status == status &&
        other.country == country &&
        other.countryCode == countryCode &&
        other.region == region &&
        other.regionName == regionName &&
        other.city == city &&
        other.zip == zip &&
        other.lat == lat &&
        other.lon == lon &&
        other.timezone == timezone &&
        other.isp == isp &&
        other.org == org &&
        other.as == as &&
        other.query == query;
  }

  @override
  int get hashCode {
    return status.hashCode ^
        country.hashCode ^
        countryCode.hashCode ^
        region.hashCode ^
        regionName.hashCode ^
        city.hashCode ^
        zip.hashCode ^
        lat.hashCode ^
        lon.hashCode ^
        timezone.hashCode ^
        isp.hashCode ^
        org.hashCode ^
        as.hashCode ^
        query.hashCode;
  }
}
