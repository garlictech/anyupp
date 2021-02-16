// GENERATED CODE - DO NOT MODIFY BY HAND

import 'package:meta/meta.dart';
import 'package:artemis/artemis.dart';
import 'package:json_annotation/json_annotation.dart';
import 'package:equatable/equatable.dart';
import 'package:gql/ast.dart';
part 'graphql_api.graphql.g.dart';

@JsonSerializable(explicitToJson: true)
class GetCustomerStripeCards$Query$StripeCard with EquatableMixin {
  GetCustomerStripeCards$Query$StripeCard();

  factory GetCustomerStripeCards$Query$StripeCard.fromJson(
          Map<String, dynamic> json) =>
      _$GetCustomerStripeCards$Query$StripeCardFromJson(json);

  String id;

  @JsonKey(
      unknownEnumValue:
          GetCustomerStripeCards$Query$StripeCard$CardBrand.ARTEMIS_UNKNOWN)
  GetCustomerStripeCards$Query$StripeCard$CardBrand brand;

  String last4;

  int exp_month;

  int exp_year;

  @override
  List<Object> get props => [id, brand, last4, exp_month, exp_year];
  Map<String, dynamic> toJson() =>
      _$GetCustomerStripeCards$Query$StripeCardToJson(this);
}

@JsonSerializable(explicitToJson: true)
class GetCustomerStripeCards$Query with EquatableMixin {
  GetCustomerStripeCards$Query();

  factory GetCustomerStripeCards$Query.fromJson(Map<String, dynamic> json) =>
      _$GetCustomerStripeCards$QueryFromJson(json);

  List<GetCustomerStripeCards$Query$StripeCard> getCustomerStripeCards;

  @override
  List<Object> get props => [getCustomerStripeCards];
  Map<String, dynamic> toJson() => _$GetCustomerStripeCards$QueryToJson(this);
}

enum GetCustomerStripeCards$Query$StripeCard$CardBrand {
  amex,
  diners,
  discover,
  jcb,
  mastercard,
  unionpay,
  visa,
  unknown,
  ARTEMIS_UNKNOWN,
}

@JsonSerializable(explicitToJson: true)
class GetCustomerStripeCardsArguments extends JsonSerializable
    with EquatableMixin {
  GetCustomerStripeCardsArguments({this.customerId});

  factory GetCustomerStripeCardsArguments.fromJson(Map<String, dynamic> json) =>
      _$GetCustomerStripeCardsArgumentsFromJson(json);

  final String customerId;

  @override
  List<Object> get props => [customerId];
  Map<String, dynamic> toJson() =>
      _$GetCustomerStripeCardsArgumentsToJson(this);
}

class GetCustomerStripeCardsQuery extends GraphQLQuery<
    GetCustomerStripeCards$Query, GetCustomerStripeCardsArguments> {
  GetCustomerStripeCardsQuery({this.variables});

  @override
  final DocumentNode document = DocumentNode(definitions: [
    OperationDefinitionNode(
        type: OperationType.query,
        name: NameNode(value: 'GetCustomerStripeCards'),
        variableDefinitions: [
          VariableDefinitionNode(
              variable: VariableNode(name: NameNode(value: 'customerId')),
              type:
                  NamedTypeNode(name: NameNode(value: 'ID'), isNonNull: false),
              defaultValue: DefaultValueNode(value: null),
              directives: [])
        ],
        directives: [],
        selectionSet: SelectionSetNode(selections: [
          FieldNode(
              name: NameNode(value: 'getCustomerStripeCards'),
              alias: null,
              arguments: [
                ArgumentNode(
                    name: NameNode(value: 'customerId'),
                    value: VariableNode(name: NameNode(value: 'customerId')))
              ],
              directives: [],
              selectionSet: SelectionSetNode(selections: [
                FieldNode(
                    name: NameNode(value: 'id'),
                    alias: null,
                    arguments: [],
                    directives: [],
                    selectionSet: null),
                FieldNode(
                    name: NameNode(value: 'brand'),
                    alias: null,
                    arguments: [],
                    directives: [],
                    selectionSet: null),
                FieldNode(
                    name: NameNode(value: 'last4'),
                    alias: null,
                    arguments: [],
                    directives: [],
                    selectionSet: null),
                FieldNode(
                    name: NameNode(value: 'exp_month'),
                    alias: null,
                    arguments: [],
                    directives: [],
                    selectionSet: null),
                FieldNode(
                    name: NameNode(value: 'exp_year'),
                    alias: null,
                    arguments: [],
                    directives: [],
                    selectionSet: null)
              ]))
        ]))
  ]);

  @override
  final String operationName = 'GetCustomerStripeCards';

  @override
  final GetCustomerStripeCardsArguments variables;

  @override
  List<Object> get props => [document, operationName, variables];
  @override
  GetCustomerStripeCards$Query parse(Map<String, dynamic> json) =>
      GetCustomerStripeCards$Query.fromJson(json);
}

@JsonSerializable(explicitToJson: true)
class StartStripePayment$Mutation with EquatableMixin {
  StartStripePayment$Mutation();

  factory StartStripePayment$Mutation.fromJson(Map<String, dynamic> json) =>
      _$StartStripePayment$MutationFromJson(json);

  String startStripePayment;

  @override
  List<Object> get props => [startStripePayment];
  Map<String, dynamic> toJson() => _$StartStripePayment$MutationToJson(this);
}

@JsonSerializable(explicitToJson: true)
class StartStripePaymentArguments extends JsonSerializable with EquatableMixin {
  StartStripePaymentArguments(
      {@required this.chainId, @required this.unitId, @required this.userId});

  factory StartStripePaymentArguments.fromJson(Map<String, dynamic> json) =>
      _$StartStripePaymentArgumentsFromJson(json);

  final String chainId;

  final String unitId;

  final String userId;

  @override
  List<Object> get props => [chainId, unitId, userId];
  Map<String, dynamic> toJson() => _$StartStripePaymentArgumentsToJson(this);
}

class StartStripePaymentMutation extends GraphQLQuery<
    StartStripePayment$Mutation, StartStripePaymentArguments> {
  StartStripePaymentMutation({this.variables});

  @override
  final DocumentNode document = DocumentNode(definitions: [
    OperationDefinitionNode(
        type: OperationType.mutation,
        name: NameNode(value: 'StartStripePayment'),
        variableDefinitions: [
          VariableDefinitionNode(
              variable: VariableNode(name: NameNode(value: 'chainId')),
              type: NamedTypeNode(name: NameNode(value: 'ID'), isNonNull: true),
              defaultValue: DefaultValueNode(value: null),
              directives: []),
          VariableDefinitionNode(
              variable: VariableNode(name: NameNode(value: 'unitId')),
              type: NamedTypeNode(name: NameNode(value: 'ID'), isNonNull: true),
              defaultValue: DefaultValueNode(value: null),
              directives: []),
          VariableDefinitionNode(
              variable: VariableNode(name: NameNode(value: 'userId')),
              type: NamedTypeNode(name: NameNode(value: 'ID'), isNonNull: true),
              defaultValue: DefaultValueNode(value: null),
              directives: [])
        ],
        directives: [],
        selectionSet: SelectionSetNode(selections: [
          FieldNode(
              name: NameNode(value: 'startStripePayment'),
              alias: null,
              arguments: [
                ArgumentNode(
                    name: NameNode(value: 'chainId'),
                    value: VariableNode(name: NameNode(value: 'chainId'))),
                ArgumentNode(
                    name: NameNode(value: 'unitId'),
                    value: VariableNode(name: NameNode(value: 'unitId'))),
                ArgumentNode(
                    name: NameNode(value: 'userId'),
                    value: VariableNode(name: NameNode(value: 'userId')))
              ],
              directives: [],
              selectionSet: null)
        ]))
  ]);

  @override
  final String operationName = 'StartStripePayment';

  @override
  final StartStripePaymentArguments variables;

  @override
  List<Object> get props => [document, operationName, variables];
  @override
  StartStripePayment$Mutation parse(Map<String, dynamic> json) =>
      StartStripePayment$Mutation.fromJson(json);
}
