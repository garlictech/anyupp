import '/graphql/generated/crud-api.dart';

class TakeAwaySession {
  final ServingMode servingMode;
  final OrderMode orderMode;

  TakeAwaySession(this.servingMode, this.orderMode);
}
