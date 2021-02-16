import 'package:equatable/equatable.dart';
import 'package:fa_prev/core/core.dart';

enum DetectionStates {
  Stopped,
  DetectingGender,
  DetectingGenderFinished,
  DetectingAge,
  DetectingAgeFinished,
  DetectinEmotion,
  DetectinEmotionFinished,
}

abstract class FaceDetectionState extends Equatable {
  const FaceDetectionState();

  @override
  List<Object> get props => [];
}

class NoFaceDetectedState extends FaceDetectionState {
  const NoFaceDetectedState();
}

class FaceEmotionState extends FaceDetectionState {
  final String emotion;

  FaceEmotionState(this.emotion);

  @override
  List<Object> get props => [emotion];
}

class FaceAgeState extends FaceDetectionState {
  final String age;

  FaceAgeState(this.age);

  @override
  List<Object> get props => [age];
}

class FaceGenderState extends FaceDetectionState {
  final String gender;

  FaceGenderState(this.gender);

  @override
  List<Object> get props => [gender];
}

class FaceDetectionCurrentState extends FaceDetectionState {
  final DetectionStates state;

  FaceDetectionCurrentState(this.state);

  @override
  List<Object> get props => [state];
}

class FaceDetectionError extends FaceDetectionState {
  final AppException error;

  const FaceDetectionError(this.error);
  
}
