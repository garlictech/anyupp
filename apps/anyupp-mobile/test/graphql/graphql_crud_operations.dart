import 'package:fa_prev/graphql/graphql.dart';

import '../test_logger.dart';
import 'generated/crud-api.dart';

Future<String?> createDummyOrder(
    String userId, String unitId, bool archived, int orderNum) async {
  // tlog.d('GraphQLCrud.createDummyOrder().unit=$unitId, user=$userId');
  try {
    var result = await GQL.amplify.execute(CreateOrderMutation(
        variables: CreateOrderArguments(
      input: CreateOrderInput(
        takeAway: false,
        servingMode: ServingMode.inPlace,
        orderMode: OrderMode.instant,
        unitId: unitId,
        userId: userId,
        archived: archived,
        paymentMode: PaymentModeInput(
          type: PaymentType.card,
          method: PaymentMethod.cash,
        ),
        sumPriceShown: PriceShownInput(
          currency: 'HUF',
          pricePerUnit: 1,
          priceSum: 1.1,
          tax: 10,
          taxSum: 0.1,
        ),
        items: [
          OrderItemInput(
            quantity: 1,
            productId: 'DUMMY_PRODUCT_$orderNum',
            variantId: 'DUMMY_VARIANT_$orderNum',
            priceShown: PriceShownInput(
              currency: 'HUF',
              pricePerUnit: 1,
              priceSum: 1.1,
              tax: 10,
              taxSum: 0.1,
            ),
            sumPriceShown: PriceShownInput(
              currency: 'HUF',
              pricePerUnit: 1,
              priceSum: 1.1,
              tax: 10,
              taxSum: 0.1,
            ),
            statusLog: [
              StatusLogInput(
                status: OrderStatus.none,
                userId: userId,
                ts: DateTime.now().millisecond.toDouble(),
              ),
            ],
            productType: ProductType.food,
            productName: LocalizedItemInput(
              hu: 'DUMMY_PRODUCT_$orderNum',
              de: 'DUMMY_PRODUCT_$orderNum',
              en: 'DUMMY_PRODUCT_$orderNum',
            ),
            variantName: LocalizedItemInput(
              hu: 'DUMMY_VARIANT_$orderNum',
              de: 'DUMMY_VARIANT_$orderNum',
              en: 'DUMMY_VARIANT_$orderNum',
            ),
          ),
        ],
      ),
    )));

    // tlog.d('GraphQLCrud.createDummyOrder().result.data=${result.data}');
    // tlog.d('GraphQLCrud.createDummyOrder().result.exception=${result.exception}');

    if (result.data?.createOrder != null) {
      String id = result.data!.createOrder!.id;
      bool archived = result.data!.createOrder!.archived;
      tlog.d(
          'GraphQLCrud.createDummyOrder().created[$orderNum]=$id, archived=$archived');
      return id;
    } else {
      return null;
    }
  } on Exception catch (e) {
    tlog.d('GraphQLCrud.createDummyOrder().Exception: $e');
    rethrow;
  }
}

Future<List<String>> createDummyOrders({
  required int count,
  required String userId,
  required String unitId,
  required bool archived,
}) async {
  List<String> ids = [];
  for (int i = 0; i < count; i++) {
    String? id = await createDummyOrder(userId, unitId, archived, i + 1);
    if (id != null) {
      ids.add(id);
    }
  }
  tlog.d('createDummyOrders().created[${ids.length}]=$ids');
  return ids;
}
