import 'package:fa_prev/graphql/generated/crud-api.graphql.dart';
import 'package:fa_prev/graphql/graphql.dart';

import '../../test_logger.dart';

Future<List<String>> listAllDummyOrders(String userId, String unitId) async {
  List<String> results = await _listAllDummyOrdersNotArchived(userId, unitId);
  results.addAll(await _listAllDummyOrdersArchived(userId, unitId));
  return results;
}

Future<List<String>> _listAllDummyOrdersNotArchived(
    String userId, String unitId) async {
  try {
    var result = await GQL.amplify.execute(
      SearchOrdersQuery(
        variables: SearchOrdersArguments(userId: userId, unitId: unitId),
      ),
    );

    // tlog.d('***** listAllDummyOrders.result.data=${result.data}');
    // tlog.d('***** listAllDummyOrders.result.errors=${result.errors}');
    if (result.data?.searchOrders?.items == null) {
      tlog.d('***** listAllDummyOrders.results=0');
      return [];
    }

    var items = result.data!.searchOrders!.items;
    if (items.isEmpty) {
      tlog.d('***** listAllDummyOrders.results=0');
      return [];
    }

    List<String> results = [];
    for (int i = 0; i < items.length; i++) {
      String item = items[i]!.id;
      results.add(item);
    }

    tlog.d('***** listAllDummyOrders.results=${results.length}');
    return results;
  } on Exception catch (e) {
    tlog.d('***** listAllDummyOrders.Exception: $e');
    rethrow;
  }
}

Future<List<String>> _listAllDummyOrdersArchived(
    String userId, String unitId) async {
  try {
    var result = await GQL.amplify.execute(
      SearchOrderHistoryQuery(
        variables: SearchOrderHistoryArguments(userId: userId, unitId: unitId),
      ),
    );

    // tlog.d('***** listAllDummyOrders.result.data=${result.data}');
    // tlog.d('***** listAllDummyOrders.result.errors=${result.errors}');
    if (result.data?.searchOrders?.items == null) {
      tlog.d('***** listAllDummyOrders.results=0');
      return [];
    }

    var items = result.data!.searchOrders!.items;
    if (items.isEmpty) {
      tlog.d('***** listAllDummyOrders.results=0');
      return [];
    }

    List<String> results = [];
    for (int i = 0; i < items.length; i++) {
      String item = items[i]!.id;
      results.add(item);
    }

    tlog.d('***** listAllDummyOrders.results=${results.length}');
    return results;
  } on Exception catch (e) {
    tlog.d('***** listAllDummyOrders.Exception: $e');
    rethrow;
  }
}
