import 'package:fa_prev/graphql/graphql.dart';
import 'generated/crud-api.dart';

Future<String> createDummyOrder(String userId, String unitId, bool archived, int orderNum) async {
  // print('GraphQLCrud.createDummyOrder().unit=$unitId, user=$userId');
  try {
    var result = await GQL.amplify.execute(CreateOrderMutation(
        variables: CreateOrderArguments(
      input: CreateOrderInput(
        takeAway: false,
        unitId: unitId,
        userId: userId,
        orderNum: 'ORDER_$orderNum',
        archived: archived,
        paymentMode: PaymentModeInput(
          type: PaymentType.card,
          method: PaymentMethod.cash,
        ),
        statusLog: [
          StatusLogInput(
            status: OrderStatus.none,
            userId: userId,
            ts: DateTime.now().millisecond.toDouble(),
          )
        ],
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

    // print('GraphQLCrud.createDummyOrder().result.data=${result.data}');
    // print('GraphQLCrud.createDummyOrder().result.exception=${result.exception}');

    if (result.data != null) {
      String id = result.data.createOrder.id;
      bool archived = result.data.createOrder.archived;
      print('GraphQLCrud.createDummyOrder().created[$orderNum]=$id, archived=$archived');
      return id;
    }

    return null;
  } on Exception catch (e) {
    print('GraphQLCrud.createDummyOrder().Exception: $e');
    rethrow;
  }
}

Future<List<String>> createDummyOrders({
  int count,
  String userId,
  String unitId,
  bool archived,
}) async {
  List<String> ids = [];
  for (int i = 0; i < count; i++) {
    String id = await createDummyOrder(userId, unitId, archived, i + 1);
    ids.add(id);
  }
  print('createDummyOrders().created[${ids.length}]=$ids');
  return ids;
}
