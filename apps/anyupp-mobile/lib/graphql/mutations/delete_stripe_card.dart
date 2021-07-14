const MUTATION_DELETE_STRIPE_CARD = '''
mutation DeleteStripeCardMutation(\$paymentMethodId: String!) {
  deleteMyStripeCard(
  input: {
    paymentMethodId: \$paymentMethodId
  })
}
''';
