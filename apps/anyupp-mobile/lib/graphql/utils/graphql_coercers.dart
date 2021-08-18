// @dart = 2.12
import 'package:intl/intl.dart';

final dateFormatter = DateFormat('yyyy-MM-dd');
final timeFormatter = DateFormat('HH:mm:ss');

DateTime fromGraphQLAWSDateTimeToDartDateTime(String date) => DateTime.parse(date);
String fromDartDateTimeToGraphQLAWSDateTime(DateTime date) => dateFormatter.format(date);
DateTime? fromGraphQLAWSDateTimeNullableToDartDateTimeNullable(String? date) =>
    date == null ? null : DateTime.parse(date);
String? fromDartDateTimeNullableToGraphQLAWSDateTimeNullable(DateTime? date) =>
    date == null ? null : dateFormatter.format(date);
