import '/core/core.dart';
import '/graphql/generated/crud-api.graphql.dart';
import '/graphql/graphql.dart';
import '/models.dart';
import '/modules/rating_tipping/rating_tipping.dart';

class AwsRatingProvider implements IRatingProvider {
  @override
  Future<bool> rateOrder(String orderId, OrderRating rating) async {
    try {
      log.d('AwsRatingProvider.rateOrder().orderId=$orderId, rating=$rating');

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
      log.d('AwsRatingProvider.rateOrder().success=$id');
      return id != null;
    } on Exception catch (e) {
      log.e('AwsRatingProvider.rateOrder.Exception: $e');
      rethrow;
    }
  }

  @override
  Future<bool> tipOrder(String orderId, TipType? tipType, double? tip) async {
    try {
      log.d(
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
      log.d('AwsRatingProvider.tipOrder().status=$status');
      return status != null;
    } on Exception catch (e) {
      log.e('AwsRatingProvider.tipOrder.Exception: $e');
      rethrow;
    }
  }

  @override
  Future<bool> noTipOrder(String orderId) async {
    try {
      log.d('AwsRatingProvider.noTipOrder().orderId=$orderId');

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
      log.e('AwsRatingProvider.noTipOrder.Exception: $e');
      rethrow;
    }
  }
}
