import 'package:fa_prev/models.dart';
import 'package:intl/intl.dart';

extension OrderExtension on Order {
  String getFormattedDate() {
    print('OrderExtension.getFormattedDate.createdAt()=$createdAt');
    if (createdAt == null) {
      return '';
    }
    final DateFormat parser = DateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
    final DateFormat formatter = DateFormat('yyyy-MM-dd HH:mm:ss');
    try {
      DateTime dateTime = parser.parseUTC(createdAt!).toLocal();
      return formatter.format(dateTime);
    } on Exception {
      return '';
    }
  }
}
