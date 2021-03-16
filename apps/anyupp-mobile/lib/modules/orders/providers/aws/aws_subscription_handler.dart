import 'dart:async';
import 'dart:convert';

import 'package:amplify_api/amplify_api.dart';
import 'package:amplify_datastore_plugin_interface/amplify_datastore_plugin_interface.dart';
import 'package:amplify_flutter/amplify.dart';
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
  final ValueNotifier<GraphQLClient> _client;

  final String listQuery;
  final String listNodeName;
  final String subscriptionQuery;
  final String subscriptionNodeName;
  final CreateModelFromJson<T> modelFromJson;
  final FilterModelFromJson<T> filterModel;

  AwsSubscription({
    authProvider,
    client,
    this.listQuery,
    this.listNodeName,
    this.subscriptionQuery,
    this.subscriptionNodeName,
    this.modelFromJson,
    this.filterModel,
  }) :
  _authProvider = authProvider,
  _client = client;

  Stream<List<T>> get stream => _listController.stream;

  Future<void> startListSubscription({Map<String, dynamic> variables}) async {
    print('**** startListSubscription[$listNodeName].variables=$variables');
    try {
      _items = await _getList(variables);
      _listController.add(_items);

      User user = await _authProvider.getAuthenticatedUserProfile();
      print('**** startListSubscription().userId=${user.id}');
      _listSubscription = _client.value
          .subscribe(
        SubscriptionOptions(
          document: gql(subscriptionQuery),
          variables: variables,
        ),
      )
          .listen((QueryResult result) async {
        print('**** startListSubscription().onData=$result');
        // print('**** startListSubscription().onData.context=${result.context}');
        print('**** startListSubscription().onData.hasException=${result.hasException}');
        if (!result.hasException) {
          T item = modelFromJson(Map<String, dynamic>.from(result.data[subscriptionNodeName]));
          print('**** startListSubscription().item=$item');
          int index = _items.indexWhere((o) => o.id == item.id);
          if (index != -1) {
            bool isFiltered = filterModel(item);
            if (isFiltered) {
              _items[index] = item;
              _listController.add(_items);
            } else {
              _items.removeAt(index);
              _listController.add(_items);
            }
          }
        }
      }, onDone: () {
        print('**** startListSubscription().onDone');
      }, onError: (error) {
        print('**** startListSubscription().onError=$error');
      }, cancelOnError: false);
    } on Exception catch (e) {
      print('startListSubscription.Exception: $e');
      rethrow;
    }
  }

  Future<List<T>> _getList(Map<String, dynamic> variables) async {
    print('_getList[$listNodeName]');
    try {
      var operation = Amplify.API.query(
        request: GraphQLRequest<String>(
          document: listQuery,
          variables: variables,
        ),
      );

      var response = await operation.response;
      var data = response.data;
      // print('***** _getList().data=$data');
      // print('***** _getList().errors=${response.errors}');
      // if (response.errors != null) {
      //   response.errors.forEach((element) {
      //     print('***** _getList().error:${element.message}');
      //   });
      // }
      Map<String, dynamic> json = jsonDecode(data);
      // print('***** _getList().json=$json');

      List<dynamic> items = json[listNodeName]['items'];
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
    } on ApiException catch (e) {
      print('_getList.ApiException: $e');
      rethrow;
    } on Exception catch (e) {
      print('_getList.Exception: $e');
      rethrow;
    }
  }

  Future<void> stopListSubscription() async {
    print('**** stopListSubscription()');
    await _listSubscription?.cancel();
    await _listController?.close();
  }
}
