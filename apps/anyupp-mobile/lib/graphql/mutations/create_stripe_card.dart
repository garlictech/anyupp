const MUTATION_CREATE_STRIPE_CARD = '''
mutation CreateStripeCardMutation(\$card: StripeCardCreateInput!) {
  createStripeCard(input: \$card) {
    brand
    country
    exp_month
    exp_year
    fingerprint
    funding
    id
    last4
    name
    three_d_secure
  }
}
''';
