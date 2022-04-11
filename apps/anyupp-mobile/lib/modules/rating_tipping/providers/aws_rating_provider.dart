import 'package:fa_prev/graphql/generated/crud-api.graphql.dart';
import 'package:fa_prev/graphql/graphql.dart';
import 'package:fa_prev/models.dart';
import 'package:fa_prev/modules/rating_tipping/rating_tipping.dart';

class AwsRatingProvider implements IRatingProvider {
  @override
  Future<bool> rateOrder(String orderId, OrderRating rating) async {
    try {
      print('AwsRatingProvider.rateOrder().orderId=$orderId, rating=$rating');

      var result = await GQL.amplify.execute(RateOrderMutation(
        variables: RateOrderArguments(
          orderId: orderId,
          questionKey: rating.key,
          rating: rating.value,
        ),
      ));

      if (result.hasErrors) {
        throw GraphQLException.fromGraphQLError(
            GraphQLException.CODE_MUTATION_EXCEPTION, result.errors);
      }

      String? id = result.data?.updateOrder?.id;
      print('AwsRatingProvider.rateOrder().success=$id');
      return id != null;
    } on Exception catch (e) {
      print('AwsRatingProvider.rateOrder.Exception: $e');
      rethrow;
    }
  }

  @override
  Future<bool> tipOrder(String orderId, TipType? tipType, double? tip) async {
    try {
      print(
          'AwsRatingProvider.tipOrder().orderId=$orderId, tipType=$tipType, tip=$tip');

      var result = await GQL.amplify.execute(TipOrderMutation(
        variables: TipOrderArguments(
          orderId: orderId,
          type: tipType ?? TipType.none,
          value: tip ?? 0,
        ),
      ));

      if (result.hasErrors) {
        throw GraphQLException.fromGraphQLError(
            GraphQLException.CODE_MUTATION_EXCEPTION, result.errors);
      }

      String? status = result.data?.payTipWithStripe?.status;
      print('AwsRatingProvider.tipOrder().status=$status');
      return status != null;
    } on Exception catch (e) {
      print('AwsRatingProvider.tipOrder.Exception: $e');
      rethrow;
    }
  }

  @override
  Future<bool> noTipOrder(String orderId) async {
    try {
      print('AwsRatingProvider.noTipOrder().orderId=$orderId');

      var result = await GQL.amplify.execute(NoTipOrderMutation(
        variables: NoTipOrderArguments(
          orderId: orderId,
        ),
      ));

      if (result.hasErrors) {
        throw GraphQLException.fromGraphQLError(
            GraphQLException.CODE_MUTATION_EXCEPTION, result.errors);
      }
      return true;
    } on Exception catch (e) {
      print('AwsRatingProvider.noTipOrder.Exception: $e');
      rethrow;
    }
  }
}
