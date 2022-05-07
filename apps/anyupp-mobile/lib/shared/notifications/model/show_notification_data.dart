class ShowNotificationParams {
  final String title;
  final String message;
  final bool showButton;

  ShowNotificationParams({
    required this.title,
    required this.message,
    this.showButton = true,
  });
}
