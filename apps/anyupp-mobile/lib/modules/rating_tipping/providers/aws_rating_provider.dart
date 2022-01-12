import 'package:fa_prev/graphql/generated/crud-api.graphql.dart';
import 'package:fa_prev/graphql/graphql.dart';
import 'package:fa_prev/modules/rating_tipping/rating_tipping.dart';

class AwsRatingProvider implements IRatingProvider {
  @override
  Future<bool> rateAndTipOrder(String orderId, int? rating,
      String? paymentMethodId, TipType? tipType, double? tip) async {
    if (rating == null && tipType == null) {
      // Nothing can do
      return true;
    }

    try {
      print(
          'AwsRatingProvider.rateAndTipOrder().orderId=$orderId, rating=$rating, tipType=$tipType, tip=$tip');

      var result = await GQL.amplify.execute(RateAndTipOrderMutation(
        variables: RateAndTipOrderArguments(
          orderId: orderId,
          rating: rating ?? -1,
          type: tipType ?? TipType.none,
          value: tip ?? 0.0,
        ),
      ));

      if (result.hasErrors) {
        throw GraphQLException.fromGraphQLError(
            GraphQLException.CODE_MUTATION_EXCEPTION, result.errors);
      }

      String? id = result.data?.updateOrder?.id;
      print('AwsRatingProvider.rateAndTipOrder().success=$id');
      return id != null;
    } on Exception catch (e) {
      print('AwsRatingProvider.rateAndTipOrder.Exception: $e');
      rethrow;
    }
  }

  @override
  Future<bool> rateOrder(String orderId, int? rating) async {
    try {
      print('AwsRatingProvider.rateOrder().orderId=$orderId, rating=$rating');

      var result = await GQL.amplify.execute(RateOrderMutation(
        variables: RateOrderArguments(
          orderId: orderId,
          rating: rating ?? -1,
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
  Future<bool> tipOrder(String orderId, String? paymentMethodId,
      TipType? tipType, double? tip) async {
    try {
      print(
          'AwsRatingProvider.tipOrder().orderId=$orderId, tipType=$tipType, tip=$tip');

      var result = await GQL.amplify.execute(TipOrderMutation(
        variables: TipOrderArguments(
          orderId: orderId,
          paymentMethodId: paymentMethodId,
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
}
