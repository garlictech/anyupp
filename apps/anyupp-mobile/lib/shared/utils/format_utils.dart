import 'package:fa_prev/graphql/utils/graphql_coercers.dart';
import 'package:fa_prev/shared/locale/extensions/locale_extension.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

// ignore: non_constant_identifier_names
final DF_SHORT = DateFormat('yyyy.MM.dd HH:mm');
final DF_TIME_SHORT = DateFormat('HH:mm');

void printWrapped(String text) {
  final pattern = RegExp('.{1,800}'); // 800 is the size of each chunk
  pattern.allMatches(text).forEach((match) => print(match.group(0)));
}

String ellapsedTimeToStringDescription(DateTime date) {
  DateTime now = DateTime.now();
  Duration difference = now.difference(date);
  if (difference.inDays > 0) {
    return '${difference.inDays} day' + (difference.inDays > 1 ? 's' : '');
  }
  if (difference.inHours > 0) {
    return '${difference.inHours} hour' + (difference.inHours > 1 ? 's' : '');
  }
  if (difference.inMinutes > 0) {
    return '${difference.inMinutes} min' +
        (difference.inMinutes > 1 ? 's' : '');
  }
  return '${difference.inSeconds} sec';
}

String formatCurrency(dynamic number, String currency) {
  return getNumberFormatter(currency).format(number);
}

NumberFormat _NF = NumberFormat('####.##');

String formatDouble(double? value) {
  return _NF.format(value ?? 0.0);
}

NumberFormat getNumberFormatter(String currency) {
  switch (currency.toLowerCase()) {
    case 'eur':
      return NumberFormat.currency(
          locale: 'en_US', symbol: '€', decimalDigits: 2); // €1,000.11
    case 'usd':
      return NumberFormat.currency(
          locale: 'en_US', symbol: '\$', decimalDigits: 2); // $1,000.11
    case 'huf':
      return NumberFormat.currency(
          locale: 'hu_HU', symbol: 'Ft', decimalDigits: 0); // 1 000,11 Ft
    default:
      return NumberFormat.currency(
          locale: 'en_US', symbol: currency, decimalDigits: 2);
  }
}

String formatOrderDate(BuildContext context, DateTime date) {
  int diffIndays = calculateDateDifferenceInDays(date);
  bool isToday = diffIndays == 0;
  bool isYesterday = diffIndays == -1;
  if (isToday) {
    return "${transEx(context, 'common.today')}, ${timeShortFormatter.format(date)}";
  }
  if (isYesterday) {
    return "${transEx(context, 'common.yesterday')}, ${timeShortFormatter.format(date)}";
  }
  return dateTimeFormatter.format(date);
}

int calculateDateDifferenceInDays(DateTime date) {
  DateTime now = DateTime.now();
  return DateTime(date.year, date.month, date.day)
      .difference(DateTime(now.year, now.month, now.day))
      .inDays;
}

String formatOrderTime(DateTime date) {
  return DF_TIME_SHORT.format(date);
}

String formatPackNumber(double pack) {
  String s = pack.toStringAsFixed(2);
  if (s.endsWith('0')) {
    s = s.substring(0, s.length - 1);
  }
  if (s.endsWith('.0')) {
    s = s.substring(0, s.length - 2);
  }
  return s;
}
