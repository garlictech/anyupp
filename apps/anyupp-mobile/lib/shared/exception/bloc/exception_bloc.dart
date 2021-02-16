import 'dart:async';

import 'package:fa_prev/shared/locale.dart';
import 'package:fa_prev/shared/widgets/common_error_dialog.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:catcher/catcher.dart';

import 'exception_event.dart';
import 'exception_state.dart';

class ExceptionBloc extends Bloc<ExceptionEvent, ExceptionState> {
  ExceptionBloc() : super(NoException());

  @override
  Stream<ExceptionState> mapEventToState(ExceptionEvent event) async* {
    if (event is ShowException) {
      final code = event.exception.code;
      final subCode = event.exception.subCode;
      var details;

      if (event.exception.details is List) {
        details = event.exception.details;
      }
      // not needed at the moment: yield NewExceptionArrivedState(event.exception);
      showErrorDialog(
          Catcher.navigatorKey.currentContext,
          transEx(
              Catcher.navigatorKey.currentContext, 'error.$subCode.title', details, 'error.$code.title', 'error.title'),
          transEx(Catcher.navigatorKey.currentContext, 'error.$subCode.description', details, 'error.$code.description',
              'error.description'));
    }
  }
}
