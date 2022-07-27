import '/core/core.dart';
import '/shared/locale.dart';
import '/shared/utils/stage_utils.dart';
import '/shared/widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';

Future<void> showExceptionDialog(BuildContext context, AppException e,
    [Color buttonColor = const Color(0xFF30BF60)]) async {
  SchedulerBinding.instance.addPostFrameCallback((_) async {
    log.d('showErrorDialog()=$e');
    await showErrorDialog(
      context,
      transEx(
        context,
        'error.${e.code}.title',
        null,
        'error.title',
      ),
      transEx(
        context,
        'error.${e.code}.description',
        e.subCode != null ? [e.subCode] : null,
        'error.description',
      ),
      exceptionDetails: isDev ? e.message : null,
      buttonColor: buttonColor,
    );
  });
}
