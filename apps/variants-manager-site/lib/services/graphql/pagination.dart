class PageResponse<T> {
  final List<T>? data;
  final String? nextToken;
  final int totalCount;

  PageResponse({
    this.data,
    this.nextToken,
    this.totalCount = 0,
  });

  @override
  String toString() =>
      'PageResponse(nextToken: $nextToken, totalCount: $totalCount, data: $data)';
}

abstract class IPaginationProvider<T> {
  Future<PageResponse<T>?> loadPage({String? nextToken});
}
