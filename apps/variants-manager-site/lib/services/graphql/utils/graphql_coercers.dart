import 'package:intl/intl.dart';

final dateFormatter = DateFormat('yyyy.MM.dd');
final timeFormatter = DateFormat('HH:mm:ss');
final timeShortFormatter = DateFormat('HH:mm');
final dateTimeFormatter = DateFormat('yyyy.MM.dd HH:mm');

DateTime fromGraphQLAWSDateTimeToDartDateTime(String date) => DateTime.parse(date).toLocal();
String fromDartDateTimeToGraphQLAWSDateTime(DateTime date) => dateFormatter.format(date);
DateTime? fromGraphQLAWSDateTimeNullableToDartDateTimeNullable(String? date) =>
    date == null ? null : DateTime.parse(date).toLocal();
String? fromDartDateTimeNullableToGraphQLAWSDateTimeNullable(DateTime? date) =>
    date == null ? null : dateFormatter.format(date);
