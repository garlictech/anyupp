import 'package:fa_prev/graphql/utils/graphql_coercers.dart';
import 'package:fa_prev/shared/locale/extensions/locale_extension.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

// ignore: non_constant_identifier_names
final DF_SHORT = DateFormat('yyyy.MM.dd HH:mm');

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
    return '${difference.inMinutes} min' + (difference.inMinutes > 1 ? 's' : '');
  }
  return '${difference.inSeconds} sec';
}

String formatCurrency(dynamic number, String currency) {
  // if (languageCode == null) {
  //   languageCode = Locale('en_US').languageCode;
  // }
  return getNumberFormatter(currency).format(number);
}

NumberFormat getNumberFormatter(String currency) {
  switch (currency.toLowerCase()) {
    case 'eur':
      return NumberFormat.currency(locale: 'en_US', symbol: '€', decimalDigits: 2); // €1,000.11
    case 'usd':
      return NumberFormat.currency(locale: 'en_US', symbol: '\$', decimalDigits: 2); // $1,000.11
    case 'huf':
      return NumberFormat.currency(locale: 'hu_HU', symbol: 'Ft', decimalDigits: 0); // 1 000,11 Ft
    default:
      return NumberFormat.currency(locale: 'en_US', symbol: currency, decimalDigits: 2);
  }
}

String formatOrderDate(BuildContext context, DateTime date) {
  final now = DateTime.now();
  bool isToday = date.difference(now).inDays == 0;
  if (isToday) {
    return "${transEx(context, 'common.today')}, ${timeShortFormatter.format(date)}";
  }
  return dateTimeFormatter.format(date);
}
