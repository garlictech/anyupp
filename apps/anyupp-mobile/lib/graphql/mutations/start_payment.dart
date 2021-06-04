String MUTATION_START_PAYMENT = '''
mutation StartPaymentMutation(\$orderId: ID!, \$paymentMethod: PaymentMethod!, \$paymentMethodId: String!, \$savePaymentMethod: Boolean!, \$address: UserInvoiceAddress) {
  startStripePayment(input: {
    orderId: \$orderId, 
    paymentMethod: \$paymentMethod, 
    paymentMethodId: \$paymentMethodId, 
    savePaymentMethod: \$savePaymentMethod,
    invoiceAddress: \$address
  }) {
    clientSecret
    status
  }
}
''';
