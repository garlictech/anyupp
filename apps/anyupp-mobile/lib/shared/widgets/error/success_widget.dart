import '/shared/widgets/error/status_widget.dart';

class SuccessWidget extends StatusWidget {
  final String title;
  final String? description;

  SuccessWidget(this.title, this.description)
      : super(
          icon: 'assets/icons/success_order.svg',
          message: title,
          description: description,
          buttonText: 'common.ok2',
        );
}
