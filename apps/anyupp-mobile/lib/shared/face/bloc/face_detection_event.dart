import 'package:equatable/equatable.dart';

abstract class FaceDetectionEvent extends Equatable {
  const FaceDetectionEvent();

  @override
  List<Object> get props => [];
}

class StartAgeAndGenderDetections extends FaceDetectionEvent {
  final bool force;
  const StartAgeAndGenderDetections({this.force = false});
}

class StartFaceEmotionDetection extends FaceDetectionEvent {
  const StartFaceEmotionDetection();
}

class StartAgeDetection extends FaceDetectionEvent {
  const StartAgeDetection();
}

class StartGenderDetection extends FaceDetectionEvent {
  const StartGenderDetection();
}

class FaceEmotionDataDetected extends FaceDetectionEvent {
  final String emotion;
  const FaceEmotionDataDetected(this.emotion);

  @override
  List<Object> get props => [emotion];
}

class FaceAgeDataDetected extends FaceDetectionEvent {
  final String age;
  const FaceAgeDataDetected(this.age);

  @override
  List<Object> get props => [age];
}

class FaceGenderDataDetected extends FaceDetectionEvent {
  final String gender;
  const FaceGenderDataDetected(this.gender);

  @override
  List<Object> get props => [gender];
}

class StopFaceRecognition extends FaceDetectionEvent {
  const StopFaceRecognition();
}
