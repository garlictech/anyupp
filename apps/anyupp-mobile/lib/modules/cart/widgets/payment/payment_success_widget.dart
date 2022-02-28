import 'package:fa_prev/shared/nav.dart';
import 'package:fa_prev/shared/widgets.dart';

class PaymentSuccessWidget extends StatusWidget {
  PaymentSuccessWidget()
      : super(
          icon: 'assets/icons/success_order.svg',
          message: 'orders.sendOrderSuccess.title',
          description: 'orders.sendOrderSuccess.description',
          expanded: true,
          buttonText: 'common.ok2',
          onPressed: () {
            Nav.pop();
          },
        );
}
