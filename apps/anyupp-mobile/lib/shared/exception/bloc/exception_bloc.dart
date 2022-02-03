import 'dart:async';

import 'package:catcher/catcher.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/shared/widgets/common_error_dialog.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import 'exception_event.dart';
import 'exception_state.dart';

class ExceptionBloc extends Bloc<ExceptionEvent, ExceptionState> {
  ExceptionBloc() : super(NoException()) {
    on<ShowException>(_onShowException);
  }

  FutureOr<void> _onShowException(
      ShowException event, Emitter<ExceptionState> emit) async {
    final code = event.exception.code;
    final subCode = event.exception.subCode;
    var details;
    print('ExceptionBloc.ShowException.exception=${event.exception}');
    print('ExceptionBloc.ShowException.code=$code');
    print('ExceptionBloc.ShowException.subCode=$subCode');

    emit(ExceptionShowState(event.exception));

    if (!event.show) {
      return;
    }

    if (event.exception.details is List) {
      details = event.exception.details;
    }

    if (Catcher.navigatorKey?.currentContext != null) {
      await Future.delayed(Duration(milliseconds: 1000));
      SchedulerBinding.instance?.addPostFrameCallback((_) async {
        await showErrorDialog(
            Catcher.navigatorKey!.currentContext!,
            transEx(
                Catcher.navigatorKey!.currentContext!,
                'error.$subCode.title',
                details,
                'error.$code.title',
                'error.title'),
            transEx(
                Catcher.navigatorKey!.currentContext!,
                'error.$subCode.description',
                details,
                'error.$code.description',
                'error.description'),
            exceptionDetails:
                null); //isDev ? event.exception.toString() : null);
      });
    }
  }
}
