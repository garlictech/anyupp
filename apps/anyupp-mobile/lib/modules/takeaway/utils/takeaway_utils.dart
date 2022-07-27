import '/core/core.dart';
import '/graphql/generated/crud-api.dart';
import '/modules/takeaway/takeaway.dart';

ServingMode get takeAwayMode =>
    getIt<TakeAwayBloc>().state is ServingModeSelectedState
        ? (getIt<TakeAwayBloc>().state as ServingModeSelectedState).servingMode
        : ServingMode.inPlace;
