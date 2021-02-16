import 'package:flutter_bloc/flutter_bloc.dart';

import 'package:fa_prev/shared/locale.dart';
import 'locale_state.dart';

class LocaleBloc extends Bloc<LocaleEvent, LocaleState> {
  LocaleBloc() : super(NoLocal());

  @override
  Stream<LocaleState> mapEventToState(LocaleEvent event) async* {
    if (event is SetLocale) {
      yield LocaleSelected(event.locale);
    }
  }
}
