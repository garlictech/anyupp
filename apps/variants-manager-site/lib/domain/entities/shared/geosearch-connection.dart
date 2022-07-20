import 'dart:convert';

import 'package:functional_data/functional_data.dart';
import 'package:json_annotation/json_annotation.dart';

part 'geosearch-connection.g.dart';

@FunctionalData()
@JsonSerializable()
class GeosearchConnectionData extends $GeosearchConnectionData {
  @override
  final List<String>? items;
  @override
  final String? nextToken;
  @override
  final int? total;

  GeosearchConnectionData({this.items, this.nextToken, this.total});

  factory GeosearchConnectionData.fromJson(Map<String, dynamic> json) =>
      _$GeosearchConnectionDataFromJson(json);

  Map<String, dynamic> toJson() => _$GeosearchConnectionDataToJson(this);
}
