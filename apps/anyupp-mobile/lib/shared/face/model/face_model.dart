
// TODO maybe use later or not... use 'string' is more simple...?!
enum EMOTION {
  anger,
  disgust,
  fear,
  happiness,
  neutral,
  sadness,
  surprise,
}

class FaceData {
  String emotion;
  String gender;
  String age;

  FaceData({
    this.emotion,
    this.gender,
    this.age,
  });
}
