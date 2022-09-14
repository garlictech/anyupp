import '/shared/pagination/pagination.dart';
import 'package:flutter/material.dart';
import 'package:flutter_staggered_animations/flutter_staggered_animations.dart';

typedef ExecuteQuery<T> = Future<PageResponse<T>> Function(String? nextToken);
typedef RenderWidget<T> = Widget Function(T item);

class PaginationListWidget<T> extends StatefulWidget {
  final ExecuteQuery<T> loadNextPage;
  final RenderWidget<T> renderListItemWidget;

  const PaginationListWidget({Key? key, required this.loadNextPage, required this.renderListItemWidget})
      : super(key: key);

  @override
  _PaginationListWidgetState<T> createState() => _PaginationListWidgetState<T>();
}

class _PaginationListWidgetState<T> extends State<PaginationListWidget> {
  String? _nextToken;
  int _totalCount = 0;
  List<T> _items = [];
  bool _hasMoreItems = true;

  @override
  void initState() {
    super.initState();
    _loadNextPage();
  }

  Future<void> _loadNextPage() async {
    var response = await widget.loadNextPage(_nextToken);
    if (_nextToken == null) {
      _items = [];
    }
    var list = <T>[];
    response.data?.forEach((element) {
      list.add(element);
    });
    _items.addAll(list);
    setState(() {
      _nextToken = response.nextToken;
      _totalCount = response.totalCount;
      _hasMoreItems = _nextToken != null && _totalCount <= _items.length;
    });
  }

  @override
  Widget build(BuildContext context) {
    return _buildList();
  }

  Widget _buildList() {
    return AnimationLimiter(
      child: ListView.builder(
        itemCount: _items.length,
        scrollDirection: Axis.vertical,
        physics: BouncingScrollPhysics(),
        itemBuilder: (context, position) {
          if (position == _items.length - 1 && _hasMoreItems) {
            _loadNextPage();
          }
          return AnimationConfiguration.staggeredList(
            position: position,
            duration: const Duration(milliseconds: 200),
            child: SlideAnimation(
              horizontalOffset: 100.0,
              child: FadeInAnimation(
                child: widget.renderListItemWidget(_items[position]),
              ),
            ),
          );
        },
      ),
    );
  }
}
