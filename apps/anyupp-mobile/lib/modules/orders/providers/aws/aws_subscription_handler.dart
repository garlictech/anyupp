// import 'dart:async';
// import 'dart:math';
// import 'package:artemis/artemis.dart';
// import 'package:fa_prev/core/core.dart';
// import 'package:fa_prev/graphql/graphql.dart';
// import 'package:fa_prev/models.dart';
// import 'package:flutter/foundation.dart';
// import 'package:graphql_flutter/graphql_flutter.dart';

// typedef CreateModelFromJson<T extends Model> = T Function(Map<String, dynamic> json);
// typedef FilterModelFromJson<T extends Model> = bool Function(T model);
// typedef SortItems<T extends Model> = void Function(List<T> items);

// const REPEAT_TIMEOUT_MS = 120000;

// class AwsSubscription<T extends Model> {
//   StreamSubscription<QueryResult> _listSubscription;
//   List<T> _items;
//   String _nextToken;
//   int _totalCount;

//   final String name;
//   final String listQuery;
//   final String listNodeName;
//   final String subscriptionQuery;
//   final String subscriptionNodeName;
//   final CreateModelFromJson<T> modelFromJson;
//   final SortItems<T> sortItems;
//   final FilterModelFromJson<T> filterModel;

//   ArtemisClient _client;

//   AwsSubscription({
//     this.name,
//     this.listQuery,
//     this.listNodeName,
//     this.subscriptionQuery,
//     this.subscriptionNodeName,
//     this.modelFromJson,
//     this.sortItems,
//     this.filterModel,
//   });

//   Future<void> startListSubscription({
//     Map<String, dynamic> variables,
//     StreamController<List<T>> controller,
//   }) async {
//     print('**** startListSubscription[$name].start().controller=$controller');
//     if (_listSubscription != null) {
//       // print('**** startListSubscription[$name].stopping');
//       await stopListSubscription();
//       // print('**** startListSubscription[$name].stopped');
//     }
//     // print('**** startListSubscription[$name].variables=$variables');

//     _items = await _getList(variables);
//     print('**** startListSubscription[$name].items=${_items?.length}');
//     controller.add(_items);

//     await _startListSubscription(variables: variables, controller: controller);

//     // Start refresh timer.
//     await _initSubscriptionRestartTimer(variables: variables);
//     // print('**** startListSubscription[$name].end()');
//   }

//   Future<void> _startListSubscription2({
//     Map<String, dynamic> variables,
//     StreamController<List<T>> controller,
//   }) async {
//     try {} on Exception catch (e) {
//       print('**** startListSubscription[$name].Exception: $e');
//       rethrow;
//     }
//     // print('**** startListSubscription[$name].end()');
//     return;
//   }

//   Future<void> _startListSubscription({
//     Map<String, dynamic> variables,
//     StreamController<List<T>> controller,
//   }) async {
//     try {
//       _client = await getIt<GraphQLClientService>().getCrudClient();
//       _listSubscription = _client.value
//           .subscribe(
//         SubscriptionOptions(
//           document: gql(subscriptionQuery),
//           variables: variables,
//           fetchPolicy: FetchPolicy.networkOnly,
//         ),
//       )
//           .listen((QueryResult result) async {
//         // print(
//         //     '**** startListSubscription[$name].onData.result.source=${result.source}');
//         print('**** startListSubscription().onData=${result.data}');
//         // print(jsonEncode(result.data));
//         // print('**** startListSubscription[$name].onData.hasException=${result.hasException}');
//         if (!result.hasException) {
//           T item = modelFromJson(Map<String, dynamic>.from(result.data[subscriptionNodeName]));
//           // print('**** startListSubscription[$name].onData.archived=${item.toJson()["archived"]}');
//           // print('**** startListSubscription[$name].onData.item=${item.toJson()}');
//           // print('**** startListSubscription[$name].onData.item=$item');
//           if (_items == null) {
//             _totalCount = 0;
//             _nextToken = null;
//             _items = [];
//           }
//           int index = _items.indexWhere((o) => o.id == item.id);
//           // print('**** startListSubscription[$name].onData.index=$index');
//           // Update or Delete
//           if (index != -1) {
//             if (filterModel != null) {
//               // print('**** startListSubscription[$name].onData.filterModel[$filterModel]=${filterModel(item)}');
//               if (filterModel(item)) {
//                 _items[index] = item;
//                 print('**** startListSubscription[$name].onData.UPDATE');
//               } else {
//                 print('**** startListSubscription[$name].onData.DELETE');
//                 _totalCount = max(0, _totalCount - 1);
//                 _items.removeAt(index);
//               }
//             } else {
//               print('**** startListSubscription[$name].onData.UPDATE2');
//               _items[index] = item;
//             }
//             controller.add(_items);
//           } else if (filterModel != null && filterModel(item)) {
//             // Add
//             print('**** startListSubscription[$name].onData.ADD');
//             _totalCount++;
//             _items.add(item);
//             if (sortItems != null) {
//               sortItems(_items);
//             }
//             controller.add(_items);
//           }
//         } else {
//           print('**** startListSubscription[$name].exception=${result.exception}');
//           // _listController.add(_items);
//           await _initSubscriptionRestartTimer(variables: variables);
//         }
//       }, onDone: () {
//         print('**** startListSubscription[$name].onDone');
//       }, onError: (error) {
//         print('**** startListSubscription[$name].onError=$error');
//         _initSubscriptionRestartTimer(variables: variables);
//       }, cancelOnError: false);
//     } on Exception catch (e) {
//       print('**** startListSubscription[$name].Exception: $e');
//       rethrow;
//     }
//     // print('**** startListSubscription[$name].end()');
//     return;
//   }

//   Future<Null> _initSubscriptionRestartTimer({Map<String, dynamic> variables}) async {
//     // Future.delayed(Duration(milliseconds: REPEAT_TIMEOUT_MS), () async {
//     //   await _startListSubscription(variables: variables);
//     // });
//     return null;
//   }

//   Future<List<T>> _getList(Map<String, dynamic> variables) async {
//     // print('_getList[$name].variables=$variables');
//     try {
//       ArtemisClient client = await GQL.crud;
//       var result = await client.execute();
//       // QueryResult result = await GQL.amplify.executeQuery(
//       //   query: listQuery,
//       //   variables: variables,
//       //   fetchPolicy: FetchPolicy.networkOnly,
//       // );

//       // print('_getList[$name].result.data=${result.data}');
//       // print('_getList[$name].result.exception=${result.exception}');
//       if (result == null || result.data == null) {
//         _nextToken = null;
//         _totalCount = 0;
//         return [];
//       }

//       List<dynamic> items = result.data[listNodeName]['items'];
//       // print('***** _getList().items=$items');
//       if (items == null || items.isEmpty) {
//         _nextToken = null;
//         _totalCount = 0;
//         return [];
//       }

//       _totalCount = result.data[listNodeName]['total'];
//       _nextToken = result.data[listNodeName]['nextToken'];

//       print('_getList[$name].nextToken=$_nextToken, total=$_totalCount');

//       List<T> results = [];
//       for (int i = 0; i < items.length; i++) {
//         T item = modelFromJson(Map<String, dynamic>.from(items[i]));
//         results.add(item);
//       }

//       // if (sortItems != null) {
//       //   sortItems(results);
//       // }

//       print('***** _getList().results.length=${results.length}');
//       return results;
//     } on Exception catch (e) {
//       print('_getList.Exception: $e');
//       rethrow;
//     }
//   }

//   bool get hasMoreItems => _nextToken != null;

//   int get itemCount => _totalCount;

//   String get nextToken => _nextToken;

//   Future<List<T>> loadNextPage({
//     Map<String, dynamic> variables,
//     String token,
//     StreamController<List<T>> controller,
//   }) async {
//     print('**** loadNextPage().nextToken=$token');
//     variables['nextToken'] = token;
//     // print('**** loadNextPage().variables=$variables');
//     List<T> items = await _getList(variables);
//     // print('**** loadNextPage().items=$items');
//     if (_items == null) {
//       _items = [];
//     }
//     if (items != null) {
//       _items.addAll(items);
//       controller.add(_items);
//     }
//     print('**** loadNextPage().total.count=${_items.length}');
//     return items;
//   }

//   Future<void> stopListSubscription() async {
//     await print('**** stopListSubscription()');
//     try {
//       await _listSubscription?.cancel();
//       _listSubscription = null;
//       _client?.dispose();
//     } on Error catch (e) {
//       await print('**** stopListSubscription().(ignored).error=$e');
//       _listSubscription = null;
//     }
//     _items = null;
//     // _listController.add(_items);
//   }
// }
