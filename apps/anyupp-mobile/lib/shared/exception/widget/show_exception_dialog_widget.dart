import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/shared/utils/stage_utils.dart';
import 'package:fa_prev/shared/widgets.dart';
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
