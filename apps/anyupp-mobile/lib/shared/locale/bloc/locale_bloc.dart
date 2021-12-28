import 'package:flutter_bloc/flutter_bloc.dart';

import 'package:fa_prev/shared/locale.dart';
import 'locale_state.dart';

class LocaleBloc extends Bloc<LocaleEvent, LocaleState> {
  LocaleBloc() : super(NoLocal()) {
    on<SetLocale>((event, emit) => emit(LocaleSelected(event.locale)));
  }
}
