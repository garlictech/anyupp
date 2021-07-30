import 'dart:async';
import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/graphql/graphql.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/shared/auth.dart';
import 'package:flutter/foundation.dart';
import 'package:graphql_flutter/graphql_flutter.dart';
import 'package:rxdart/rxdart.dart';

typedef CreateModelFromJson<T extends Model> = T Function(Map<String, dynamic> json);
typedef FilterModelFromJson<T extends Model> = bool Function(T model);
typedef SortItems<T extends Model> = void Function(List<T> items);

const REPEAT_TIMEOUT_MS = 120000;

class AwsSubscription<T extends Model> {
  StreamSubscription<QueryResult> _listSubscription;
  StreamController<List<T>> _listController = BehaviorSubject<List<T>>();
  List<T> _items;
  String _nextToken;
  int _totalCount;

  final IAuthProvider _authProvider;
  final String listQuery;
  final String listNodeName;
  final String subscriptionQuery;
  final String subscriptionNodeName;
  final CreateModelFromJson<T> modelFromJson;
  final SortItems<T> sortItems;

  ValueNotifier<GraphQLClient> _client;

  AwsSubscription({
    authProvider,
    this.listQuery,
    this.listNodeName,
    this.subscriptionQuery,
    this.subscriptionNodeName,
    this.modelFromJson,
    this.sortItems,
  }) : _authProvider = authProvider;

  Stream<List<T>> get stream => _listController?.stream;

  Future<void> startListSubscription({Map<String, dynamic> variables}) async {
    if (_listSubscription != null) {
      await stopListSubscription();
    }
    print('**** startListSubscription[$listNodeName].variables=$variables');

    _items = await _getList(variables);
    // print('**** startListSubscription[$listNodeName].items=${_items?.length}');
    _listController.add(_items);

    await _startListSubscription(variables: variables);

    // Start refresh timer.
    Future.delayed(Duration(milliseconds: REPEAT_TIMEOUT_MS), () async {
      await _startListSubscription(variables: variables);
    });
  }

  Future<void> _startListSubscription({Map<String, dynamic> variables}) async {
    try {
      User user = await _authProvider.getAuthenticatedUserProfile();
      print('**** startListSubscription[$listNodeName].userId=${user.id}');
      _client = await getIt<GraphQLClientService>().getCrudClient();
      _listSubscription = _client.value
          .subscribe(
        SubscriptionOptions(
          document: gql(subscriptionQuery),
          variables: variables,
          fetchPolicy: FetchPolicy.networkOnly,
        ),
      )
          .listen((QueryResult result) async {
        // print('**** startListSubscription[$listNodeName].onData.result.source=${result.source}');
        // print('**** startListSubscription().onData=${result.data}');
        // print(jsonEncode(result.data));
        // print('**** startListSubscription[$listNodeName].onData.hasException=${result.hasException}');
        if (!result.hasException) {
          T item = modelFromJson(Map<String, dynamic>.from(result.data[subscriptionNodeName]));
          // print('**** startListSubscription[$listNodeName].onData.item=$item');
          if (_items == null) {
            _items = [];
          }
          int index = _items.indexWhere((o) => o.id == item.id);
          // print('**** startListSubscription[$listNodeName].index=$index');
          if (index != -1) {
            _items[index] = item;
            _listController.add(_items);
          } else {  
            _items.add(item);
            if (sortItems != null) {
              sortItems(_items);
            }
            _listController.add(_items);
          }
        } else {
          print('**** startListSubscription[$listNodeName].exception=${result.exception}');
          _listController.add(_items);
          Future.delayed(Duration(milliseconds: REPEAT_TIMEOUT_MS), () async {
            await _startListSubscription(variables: variables);
          });
        }
      }, onDone: () {
        print('**** startListSubscription[$listNodeName].onDone');
      }, onError: (error) {
        print('**** startListSubscription[$listNodeName].onError=$error');
      }, cancelOnError: false);
    } on Exception catch (e) {
      print('**** startListSubscription[$listNodeName].Exception: $e');
      rethrow;
    }
  }

  Future<List<T>> _getList(Map<String, dynamic> variables) async {
    // print('_getList[$listNodeName].query=$listQuery');
    print('_getList[$listNodeName].variables=$variables');
    try {
      QueryResult result = await GQL.amplify.executeQuery(
        query: listQuery,
        variables: variables,
        fetchPolicy: FetchPolicy.networkOnly,
      );

      // print('_getList[$listNodeName].result.data=${result.data}');
      // print('_getList[$listNodeName].result.exception=${result.exception}');
      if (result == null || result.data == null) {
        return [];
      }

      List<dynamic> items = result.data[listNodeName]['items'];
      // print('***** _getList().items=$items');
      if (items == null || items.isEmpty) {
        _nextToken = null;
        return null;
      }

      _totalCount = result.data[listNodeName]['total'];
      _nextToken = result.data[listNodeName]['nextToken'];

      print('_getList[$listNodeName].nextToken=$_nextToken, total=$_totalCount');

      List<T> results = [];
      for (int i = 0; i < items.length; i++) {
        T item = modelFromJson(Map<String, dynamic>.from(items[i]));
        results.add(item);
      }

      // if (sortItems != null) {
      //   sortItems(results);
      // }

      print('***** _getList().results.length=${results.length}');
      return results;
    } on Exception catch (e) {
      print('_getList.Exception: $e');
      rethrow;
    }
  }

  bool get hasMoreItems => _nextToken != null;

  int get itemCount => _totalCount;

  String get nextToken => _nextToken;

  Future<List<T>> loadNextPage(Map<String, dynamic> variables, String token) async {
    print('**** loadNextPage().nextToken=$token');
    variables['nextToken'] = token;
    // print('**** loadNextPage().variables=$variables');
    List<T> items = await _getList(variables);
    // print('**** loadNextPage().items=$items');
    if (_items == null) {
      _items = [];
    }
    if (items != null) {
      _items.addAll(items);
      _listController.add(_items);
    }
    print('**** loadNextPage().total.count=${_items.length}');
    return items;
  }

  Future<void> stopListSubscription() async {
    await print('**** stopListSubscription()');
    try {
      await _listSubscription?.cancel();
      _listSubscription = null;
      _client?.dispose();
    } on Error catch (e) {
      await print('**** stopListSubscription().(ignored).error=$e');
      _listSubscription = null;
    }
  }
}
