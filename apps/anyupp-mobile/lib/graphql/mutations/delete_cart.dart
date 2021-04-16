const MUTATION_DELETE_CART = '''
mutation DeleteCartMutation(\$cartId: ID!) {
  deleteCart(input: {id: \$cartId}) {
    id
  }
}
''';
