import 'package:fa_prev/graphql/generated/crud-api.graphql.dart';
import 'package:fa_prev/graphql/graphql.dart';

Future<List<String>> listAllDummyOrders(String userId, String unitId, bool archived) async {
  try {
    var result = await GQL.amplify.execute(
      SearchOrdersQuery(
        variables: SearchOrdersArguments(userId: userId, unitId: unitId),
      ),
    );

    // print('***** listAllDummyOrders.result.data=${result.data}');
    // print('***** listAllDummyOrders.result.exception=${result.exception}');
    if (result.data?.searchOrders == null) {
      print('***** listAllDummyOrders.results=0');
      return [];
    }

    var items = result.data!.searchOrders!.items;
    if (items == null || items.isEmpty) {
      print('***** listAllDummyOrders.results=0');
      return [];
    }

    List<String> results = [];
    for (int i = 0; i < items.length; i++) {
      String item = items[i]!.id;
      results.add(item);
    }

    print('***** listAllDummyOrders.results=${results.length}');
    return results;
  } on Exception catch (e) {
    print('***** listAllDummyOrders.Exception: $e');
    rethrow;
  }
}
