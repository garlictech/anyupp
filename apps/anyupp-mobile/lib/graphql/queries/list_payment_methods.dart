const QUERY_LIST_PAYMENT_METHODS = '''
query ListStripePaymentMethodsQuery {
  listStripeCards {
    id
    brand
    country
    exp_month
    exp_year
    fingerprint
    funding
    last4
    three_d_secure
    name
  }
}
''';
