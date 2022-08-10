import 'package:anyupp/models.dart';

User MOCK_USER([String? id]) => User(
      id: id ?? 'test@anyupp.com',
      email: 'test@anyupp.com',
      name: 'Test User',
      phone: '+36701234567',
      profileImage: 'https://picsum.photos/100',
      invoiceAddress: UserInvoiceAddress(
        city: 'Budapest',
        country: 'Hungary',
        customerName: 'Test User',
        email: 'test@anyupp.com',
        postalCode: '1000',
        streetAddress: 'Test utca 1',
        taxNumber: '12345678-1-12',
      ),
    );
