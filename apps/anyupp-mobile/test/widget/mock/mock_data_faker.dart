import 'package:fa_prev/models.dart';
import 'package:faker/faker.dart';
import 'package:fa_prev/graphql/generated/crud-api.dart';

class MockGenerator {
  static final faker = Faker();

  static List<Transaction> generateTransactions({required int count, String? userId, String? orderId}) {
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

  static Invoice generateInvoice({String? userId, String? transactionId, String? orderId}) {
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

  static Receipt generateReceipt({String? userId, String? transactionId, String? orderId}) {
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
}
