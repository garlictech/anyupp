import 'package:equatable/equatable.dart';

abstract class FaceInfoState extends Equatable {
  const FaceInfoState();

  @override
  List<Object> get props => [];
}

class FaceAgeGenderInfo extends FaceInfoState {
  final String gender;
  final String age;

  FaceAgeGenderInfo(this.gender, this.age);

  @override
  List<Object> get props => [gender, age];
}

class FaceEmotionInfo extends FaceInfoState {
  final String emotion;

  FaceEmotionInfo(this.emotion);

  @override
  List<Object> get props => [emotion];
}
