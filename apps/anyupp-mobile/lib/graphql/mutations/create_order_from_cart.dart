const MUTATION_CREATE_ORDER_FROM_CART = '''
mutation CreateOrderFromCartMutation(\$cartId: ID!) {
  createOrderFromCart(input: {id: \$cartId})
}
''';
