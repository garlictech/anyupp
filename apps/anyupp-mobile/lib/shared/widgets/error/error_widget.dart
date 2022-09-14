import '/shared/widgets/error/status_widget.dart';
import 'package:flutter/material.dart';

class CommonErrorWidget extends StatusWidget {
  final String error;
  final String? description;
  final String? errorDetails;
  final VoidCallback? onPressed;
  final bool? showButton;
  final bool expanded;
  final String buttonText;
  final bool showIcon;
  final Color? buttonColor;

  CommonErrorWidget({
    required this.error,
    this.description,
    this.errorDetails,
    this.onPressed,
    this.showButton = true,
    this.expanded = true,
    this.buttonText = 'common.ok2',
    this.showIcon = true,
    this.buttonColor,
  }) : super(
          icon: 'assets/icons/error-icon.svg',
          message: error,
          description: description,
          details: errorDetails,
          buttonText: buttonText,
          onPressed: onPressed,
          showButton: showButton,
          expanded: expanded,
          buttonColor: buttonColor,
        );
}
