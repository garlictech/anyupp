import 'package:fa_prev/core/core.dart';
import 'package:fa_prev/graphql/generated/crud-api.dart';
import 'package:fa_prev/modules/takeaway/takeaway.dart';

ServingMode get takeAwayMode =>
    getIt<TakeAwayBloc>().state is ServingModeSelectedState
        ? (getIt<TakeAwayBloc>().state as ServingModeSelectedState).servingMode
        : ServingMode.inPlace;
