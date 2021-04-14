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

class AwsSubscription<T extends Model> {
  StreamSubscription<QueryResult> _listSubscription;
  StreamController<List<T>> _listController = BehaviorSubject<List<T>>();
  List<T> _items;
  final IAuthProvider _authProvider;

  final String listQuery;
  final String listNodeName;
  final String subscriptionQuery;
  final String subscriptionNodeName;
  final CreateModelFromJson<T> modelFromJson;
  final FilterModelFromJson<T> filterModel;

  AwsSubscription({
    authProvider,
    this.listQuery,
    this.listNodeName,
    this.subscriptionQuery,
    this.subscriptionNodeName,
    this.modelFromJson,
    this.filterModel,
  }) : _authProvider = authProvider;

  Stream<List<T>> get stream => _listController?.stream;

  Future<void> startListSubscription({Map<String, dynamic> variables}) async {
    print('**** startListSubscription[$listNodeName].variables=$variables');
    try {
      if (_listController == null) {
        _listController = BehaviorSubject<List<T>>();
      }
      // await _listSubscription?.cancel();

      _items = await _getList(variables);
      print('**** startListSubscription[$listNodeName].items=${_items?.length}');
      _listController.add(_items);

      User user = await _authProvider.getAuthenticatedUserProfile();
      print('**** startListSubscription[$listNodeName].userId=${user.id}');
      ValueNotifier<GraphQLClient> _client = await getIt<GraphQLClientService>().getAmplifyClient();
      _listSubscription = _client.value
          .subscribe(
        SubscriptionOptions(
          document: gql(subscriptionQuery),
          variables: variables,
          fetchPolicy: FetchPolicy.networkOnly, // TODO AWS atnezni
        ),
      )
          .listen((QueryResult result) async {
        print('**** startListSubscription[$listNodeName].onData=$result');
        // print('**** startListSubscription().onData.context=${result.context}');
        print('**** startListSubscription[$listNodeName].onData.hasException=${result.hasException}');
        if (!result.hasException) {
          T item = modelFromJson(Map<String, dynamic>.from(result.data[subscriptionNodeName]));
          print('**** startListSubscription[$listNodeName].item=$item');
          int index = _items.indexWhere((o) => o.id == item.id);
          // print('**** startListSubscription[$listNodeName].index=$index');
          if (index != -1) {
            bool isFiltered = true; // TODO filterModel(item) ?? true;
            if (isFiltered) {
              _items[index] = item;
              _listController.add(_items);
            } else {
              _items.removeAt(index);
              _listController.add(_items);
            }
          } else {
            _items.add(item);
            _listController.add(_items);
          }
        } else {
          print('**** startListSubscription[$listNodeName].exception=${result.exception}');
          _listController.add(_items);
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
    // print('_getList[$listNodeName]');
    try {
      ValueNotifier<GraphQLClient> _client = await getIt<GraphQLClientService>().getAmplifyClient();
      QueryResult result = await _client.value.query(QueryOptions(
        document: gql(listQuery),
        variables: variables,
        fetchPolicy: FetchPolicy.networkOnly,
      ));
      // print('_getList[$listNodeName].result.data=${result.data}');
      // print('_getList[$listNodeName].result.exception=${result.exception}');
      if (result == null || result.data == null) {
        return [];
      }

      List<dynamic> items = result.data[listNodeName]['items'];
      // print('***** _getList().items=$items');
      if (items == null || items.isEmpty) {
        return null;
      }

      List<T> results = [];
      for (int i = 0; i < items.length; i++) {
        results.add(modelFromJson(Map<String, dynamic>.from(items[i])));
      }

      // print('***** _getList().results=$results');
      return results;
    } on Exception catch (e) {
      print('_getList.Exception: $e');
      rethrow;
    }
  }

  Future<void> stopListSubscription() async {
    print('**** stopListSubscription()');
    await _listSubscription?.cancel();
    await _listController?.close();
    _listSubscription = null;
    _listController = null;
  }
}
