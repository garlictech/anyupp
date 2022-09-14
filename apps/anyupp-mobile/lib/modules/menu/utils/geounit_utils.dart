import '/models.dart';

class UnitUtils {
  static bool isClosed(Unit unit) {
    return unit.isAcceptingOrders;
  }

  static String getClosedText(
      Unit unit, String closed, String opens, String day) {
    return closed;
  }
}
