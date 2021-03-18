import 'face_info_event.dart';
import 'face_info_state.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class FaceInfoBloc extends Bloc<FaceInfoEvent, FaceInfoState> {
  FaceInfoBloc(FaceInfoState initialState) : super(initialState);

  @override
  Stream<FaceInfoState> mapEventToState(FaceInfoEvent event) {
    // TODO: implement mapEventToState
    throw UnimplementedError();
  }
}
