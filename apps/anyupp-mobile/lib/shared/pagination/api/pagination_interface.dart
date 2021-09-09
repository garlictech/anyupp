import 'package:fa_prev/shared/pagination/pagination.dart';

abstract class IPaginationProvider<T> {
  Future<PageResponse<T>?> loadPage({String? nextToken});
}
