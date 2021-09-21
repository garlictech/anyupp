import 'package:fa_prev/graphql/graphql.dart';

import '../generated/crud-api.dart';
import 'list_all_orders.dart';

Future<List<bool>> deleteAllOrders(String userId, String unitId) async {
  print('deleteAllOrders().userId=$userId, unitId=$unitId');
  List<String> orderIdList = await listAllDummyOrders(userId, unitId);
  return await _deleteDummyOrders(orderIdList);
}

Future<List<bool>> _deleteDummyOrders(List<String> orderIdList) async {
  List<bool> deleteResults = [];
  for (int i = 0; i < orderIdList.length; i++) {
    bool deleted = await _deleteOrder(orderIdList[i]);
    deleteResults.add(deleted);
    print('Order deleted[$i]=${orderIdList[i]}');
  }
  return deleteResults;
}

Future<bool> _deleteOrder(String id) async {
  try {
    var result = await GQL.amplify.execute(DeleteOrderMutation(
      variables: DeleteOrderArguments(
        id: id,
      ),
    ));

    return !result.hasErrors;
  } on Exception catch (e) {
    print('AwsOrderProvider._deleteCartFromBackend.Exception: $e');
    rethrow;
  }
}
