import 'dart:async';

import '/shared/exception.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class ExceptionBloc extends Bloc<ExceptionEvent, ExceptionState> {
  ExceptionBloc() : super(NoException()) {
    on<ShowException>(_onShowException);
    on<AddExceptionToBeShown>(_onAddExceptionToBeShown);
  }

  FutureOr<void> _onShowException(
      ShowException event, Emitter<ExceptionState> emit) async {
    // log.d('ExceptionBloc.ShowException.exception=${event.exception}');

    emit(ExceptionShowState(event.exception));
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
