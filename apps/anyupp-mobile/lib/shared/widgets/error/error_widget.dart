import 'package:fa_prev/shared/widgets/error/status_widget.dart';
import 'package:flutter/material.dart';

class CommonErrorWidget extends StatusWidget {
  final String error;
  final String? description;
  final String? errorDetails;
  final VoidCallback? onPressed;
  final bool? showButton;

  CommonErrorWidget({
    required this.error,
    this.description,
    this.errorDetails,
    this.onPressed,
    this.showButton = false,
  }) : super(
          icon: 'assets/icons/error-icon.svg',
          message: error,
          description: description,
          details: errorDetails,
          buttonText: 'common.ok2',
          onPressed: onPressed,
          showButton: showButton,
          buttonColor: const Color(0xFFE74C3C),
        );
}
