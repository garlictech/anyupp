import 'dart:math';

import 'package:fa_prev/graphql/generated/crud-api.dart';
import 'package:fa_prev/models.dart';
import 'package:faker/faker.dart' hide Address;

class MockGenerator {
  static final faker = Faker();
  static final Random rnd = Random();

  static List<Transaction> generateTransactions(
      {required int count, String? userId, String? orderId}) {
    var results = <Transaction>[];
    for (int i = 0; i < count; i++) {
      results.add(
        generateTransaction(
          userId: userId,
          orderId: orderId,
        ),
      );
    }
    return results;
  }

  static Transaction generateTransaction({String? userId, String? orderId}) {
    String id = faker.guid.guid();
    return Transaction(
      id: id,
      userId: userId ?? faker.guid.guid(),
      orderId: orderId ?? faker.guid.guid(),
      createdAt: DateTime.now().toString(),
      updatedAt: DateTime.now().toString(),
      currency: 'HUF',
      total: 100,
      status: PaymentStatus.success,
      type: 'inapp',
      invoice: generateInvoice(
        userId: userId,
        orderId: orderId,
        transactionId: id,
      ),
      receipt: generateReceipt(
        userId: userId,
        orderId: orderId,
        transactionId: id,
      ),
    );
  }

  static Invoice generateInvoice(
      {String? userId, String? transactionId, String? orderId}) {
    return Invoice(
      id: faker.guid.guid(),
      orderId: orderId ?? faker.guid.guid(),
      userId: userId ?? faker.guid.guid(),
      transactionId: transactionId ?? faker.guid.guid(),
      streetAddress: faker.address.streetAddress(),
      status: 'success',
      postalCode: faker.address.zipCode(),
      customerName: faker.person.name(),
      country: faker.address.countryCode(),
      city: faker.address.city(),
      email: faker.internet.email(),
      createdAt: DateTime.now().toString(),
      updatedAt: DateTime.now().toString(),
      externalInvoiceId: faker.guid.guid(),
      pdfUrl: faker.internet.httpsUrl(),
    );
  }

  static Receipt generateReceipt(
      {String? userId, String? transactionId, String? orderId}) {
    return Receipt(
      id: faker.guid.guid(),
      orderId: orderId ?? faker.guid.guid(),
      userId: userId ?? faker.guid.guid(),
      transactionId: transactionId ?? faker.guid.guid(),
      status: 'success',
      email: faker.internet.email(),
      createdAt: DateTime.now().toString(),
      updatedAt: DateTime.now().toString(),
      pdfData: null,
    );
  }

  static Order generateOrder({
    required String name,
    required PaymentMethod method,
    required PaymentType paymentType,
    required OrderStatus status,
    required double price,
    int itemCount = 1,
    bool archived = false,
  }) {
    String id = faker.guid.guid();
    List<OrderItem> items = [];
    for (int i = 0; i < itemCount; i++) {
      items.add(generateOrderItem(
        productId: id,
        name: name + '_I_$i',
        variantName: name + '_V_$i',
        price: price / itemCount,
        quantity: 1,
        status: status,
      ));
    }
    return Order(
      id: id,
      orderNum: '00001',
      userId: 'DUMMY_USER_ID',
      unitId: 'DUMMY_UNIT_ID',
      items: items,
      paymentMode: PaymentMode(
        method: method,
        type: paymentType,
      ),
      sumPriceShown: PriceShown(
        currency: 'HUF',
        pricePerUnit: price,
        priceSum: price,
        tax: 0,
        taxSum: 0,
      ),
      // statusLog: [
      //   StatusLog(
      //     userId: 'DUMMY_USER_ID',
      //     status: status,
      //     ts: DateTime.now().millisecond.toDouble(),
      //   )
      // ],
      archived: archived,
      createdAt: DateTime.now(),
      updatedAt: DateTime.now(),
      orderPolicy: OrderPolicy.full,
      currentStatus: status,
    );
  }

  static OrderItem generateOrderItem({
    String? productId,
    required String name,
    required String variantName,
    required double price,
    required OrderStatus status,
    int quantity = 1,
    double packagingFee = 0.0,
  }) {
    return OrderItem(
        productId: productId ?? faker.guid.guid(),
        variantId: faker.guid.guid(),
        productName: LocalizedItem(
          en: name,
          hu: name,
          de: name,
        ),
        priceShown: PriceShown(
          currency: 'HUF',
          pricePerUnit: price,
          priceSum: price * quantity,
          tax: 0,
          taxSum: 0,
        ),
        sumPriceShown: PriceShown(
          currency: 'HUF',
          pricePerUnit: price,
          priceSum: price * quantity,
          tax: 0,
          taxSum: 0,
        ),
        quantity: quantity,
        statusLog: [
          StatusLog(
            userId: 'DUMMY_USER_ID',
            status: status,
            ts: DateTime.now().millisecond.toDouble(),
          )
        ],
        variantName: LocalizedItem(
          en: variantName,
          hu: variantName,
          de: variantName,
        ),
        productType: ProductType.food,
        netPackagingFee: packagingFee);
  }

  static GeneratedProductConfigSet generateEmptyProductConfigSet({
    required String name,
    String? productSetId,
    List<ServingMode> supportedServingModes = const [
      ServingMode.inPlace,
      ServingMode.takeAway,
    ],
    ProductComponentSetType type = ProductComponentSetType.modifier,
    String? description,
    int maxSelection = 1,
    int position = 0,
  }) {
    return GeneratedProductConfigSet(
      name: LocalizedItem(
        hu: name,
        de: name,
        en: name,
      ),
      items: [],
      supportedServingModes: supportedServingModes,
      type: type,
      productSetId: productSetId ?? faker.guid.guid(),
      description: description,
      maxSelection: maxSelection,
      position: position,
    );
  }

  static OrderItemConfigSet generateEmptyOrderItemConfigSet({
    String? productSetId,
    required String name,
    ProductComponentSetType type = ProductComponentSetType.modifier,
  }) {
    return OrderItemConfigSet(
      name: LocalizedItem(
        hu: name,
        de: name,
        en: name,
      ),
      productSetId: productSetId ?? faker.guid.guid(),
      type: type,
      items: [],
    );
  }

  static OrderItemConfigComponent generateOrderItemConfigComponent({
    String? productComponentId,
    required String name,
    double? price = 0.0,
  }) {
    return OrderItemConfigComponent(
      name: LocalizedItem(
        hu: name,
        de: name,
        en: name,
      ),
      productComponentId: productComponentId ?? faker.guid.guid(),
      price: price ?? 0.0,
    );
  }

  static GeoUnit generateUnit({
    String? id,
    required String name,
    required String currency,
    OrderPolicy? orderPolicy = OrderPolicy.full,
  }) {
    return GeoUnit(
      id: id ?? faker.guid.guid(),
      groupId: faker.guid.guid(),
      chainId: faker.guid.guid(),
      name: name,
      address: Address(
        address: 'Test Street',
        city: 'Budapest',
        country: 'Hungary',
        title: 'Test Address',
        postalCode: '1000',
        location: Location(
          lat: 0,
          lng: 0,
        ),
      ),
      style: ChainStyle(
        colors: ChainStyleColors(
          backgroundLight: '#ffffff',
          backgroundDark: '#ffffff',
          borderLight: '#ffffff',
          borderDark: '#ffffff',
          disabled: '#ffffff',
          highlight: '#ffffff',
          indicator: '#ffffff',
          textLight: '#ffffff',
          textDark: '#ffffff',
          primary: '#ffffff',
          secondary: '#ffffff',
        ),
      ),
      distance: 0,
      currency: currency,
      isAcceptingOrders: true,
      openingHoursNext7: [],
      supportedServingModes: [
        ServingMode.inPlace,
        ServingMode.takeAway,
      ],
      supportedOrderModes: [
        OrderMode.instant,
        OrderMode.pickup,
      ],
      orderPolicy: OrderPolicy.full,
      packagingTax: 5.0,
    );
  }

  static GeneratedProduct generateProduct({
    required String name,
    List<ServingMode> servingModes = const [
      ServingMode.inPlace,
      ServingMode.takeAway
    ],
    int variantCount = 3,
    int configSetCount = 1,
  }) {
    assert(variantCount >= 1);
    List<ProductVariant> variants = [];
    for (int i = 0; i < variantCount; i++) {
      variants.add(
        generateProductVariant(
          name: 'VARIANT_$i',
          price: 100.0 * (i + 1),
          position: i,
        ),
      );
    }

    List<GeneratedProductConfigSet> configSets = [];
    for (int i = 0; i < configSetCount; i++) {
      configSets.add(generateProductConfigSet(
        name: '${name}_config_$i',
        position: i,
      ));
    }
    return GeneratedProduct(
      id: faker.guid.guid(),
      unitId: faker.guid.guid(),
      productCategoryId: faker.guid.guid(),
      allergens: generateAllergeens(3),
      image: 'https://via.placeholder.com/150',
      description: LocalizedItem(
        en: '${name}_description',
        de: '${name}_description',
        hu: '${name}_description',
      ),
      name: LocalizedItem(
        en: name,
        de: name,
        hu: name,
      ),
      productType: ProductType.drink,
      tax: 10,
      position: 0,
      variants: variants,
      supportedServingModes: servingModes,
      configSets: configSets,
    );
  }

  static ProductVariant generateProductVariant({
    required String name,
    required double price,
    required int position,
    ProductVariantPack? pack,
  }) {
    return ProductVariant(
      id: faker.guid.guid(),
      variantName: LocalizedItem(
        en: name,
        de: name,
        hu: name,
      ),
      price: price,
      position: position,
      pack: pack,
      soldOut: false,
    );
  }

  static GeneratedProductConfigSet generateProductConfigSet({
    required String name,
    required int position,
    List<ServingMode> servingModes = const [
      ServingMode.inPlace,
      ServingMode.takeAway,
    ],
    int itemCount = 3,
  }) {
    List<GeneratedProductConfigComponent> items = [];
    for (int i = 0; i < itemCount; i++) {
      items.add(generateProductConfigComponent(
        position: i,
        name: '${name}_$i',
        price: (i + 1) * 100,
      ));
    }
    return GeneratedProductConfigSet(
      productSetId: faker.guid.guid(),
      name: LocalizedItem(
        de: name,
        hu: name,
        en: name,
      ),
      type: ProductComponentSetType.modifier,
      items: items,
      supportedServingModes: servingModes,
      description: 'Description of $name',
      position: position,
      maxSelection: itemCount,
    );
  }

  static GeneratedProductConfigComponent generateProductConfigComponent({
    required String name,
    required double price,
    int position = 0,
    int allergensCount = 2,
    double packagingFee = 0.0,
  }) {
    List<Allergen> allergeens = generateAllergeens(allergensCount);
    return GeneratedProductConfigComponent(
      productComponentId: faker.guid.guid(),
      price: price,
      position: position,
      name: LocalizedItem(
        de: name,
        hu: name,
        en: name,
      ),
      allergens: allergeens,
      netPackagingFee: packagingFee,
    );
  }

  static List<Allergen> generateAllergeens(int count) {
    List<Allergen> allergeens = [];
    for (int i = 0; i < count; i++) {
      allergeens.add(Allergen.values[rnd.nextInt(Allergen.values.length - 1)]);
    }
    return allergeens;
  }

  static Cart generateBasicCart({
    String? userId,
    String? unitId,
    ServingMode servingMode = ServingMode.inPlace,
  }) {
    return Cart(
      userId: userId ?? faker.guid.guid(),
      unitId: unitId ?? faker.guid.guid(),
      items: [],
      servingMode: servingMode,
      orderPolicy: OrderPolicy.full,
    );
  }
}
