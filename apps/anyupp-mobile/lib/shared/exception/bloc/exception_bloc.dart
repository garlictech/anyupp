import 'dart:async';

import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/shared/exception.dart';
import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/shared/widgets/common_error_dialog.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class ExceptionBloc extends Bloc<ExceptionEvent, ExceptionState> {
  ExceptionBloc() : super(NoException()) {
    on<ShowException>(_onShowException);
    on<AddExceptionToBeShown>(_onAddExceptionToBeShown);
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

    if (AppContext.context != null) {
      await Future.delayed(Duration(milliseconds: 1000));
      SchedulerBinding.instance?.addPostFrameCallback((_) async {
        await showErrorDialog(
          AppContext.context!,
          transEx(AppContext.context!, 'error.$subCode.title', details,
              'error.$code.title', 'error.title'),
          transEx(AppContext.context!, 'error.$subCode.description', details,
              'error.$code.description', 'error.description'),
          exceptionDetails: null,
          // onClose: () => emit(NoException()),
        ); //isDev ? event.exception.toString() : null);
      });
    }
  }

  FutureOr<void> _onAddExceptionToBeShown(
      AddExceptionToBeShown event, Emitter<ExceptionState> emit) async {
    emit(
      ExceptionShowState(CommonException(
        code: event.code,
        message: event.message,
        subCode: event.provider,
      )),
    );
  }
}
