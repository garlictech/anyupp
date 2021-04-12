String MUTATION_SAVE_CART = '''
mutation CreateCartMutation(\$createCartInput: CreateCartInput!) {
  createCart(input: \$createCartInput)
  {
    id
  }
}
''';
