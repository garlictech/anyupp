import 'package:equatable/equatable.dart';

abstract class FaceInfoEvent extends Equatable {
  const FaceInfoEvent();

  @override
  List<Object> get props => [];
}

class GetFaceEmotionInfo extends FaceInfoEvent {
  const GetFaceEmotionInfo();
}

class GetFaceAgeGenderInfo extends FaceInfoEvent {
  const GetFaceAgeGenderInfo();
}
