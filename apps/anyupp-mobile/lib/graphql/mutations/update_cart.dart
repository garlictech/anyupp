String MUTATION_UPDATE_CART = '''
mutation UpdateCartMutation(\$updateCartInput: UpdateCartInput!) {
  updateCart(input: \$updateCartInput)
  {
    id
  }
}
''';
