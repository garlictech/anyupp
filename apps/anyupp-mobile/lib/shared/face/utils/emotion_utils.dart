import 'package:firebase_ml_vision/firebase_ml_vision.dart';

enum FaceEmotion { NEUTRAL, SAD, SMILING }

FaceEmotion getEmotionFromProbability(double probability) {
  if (probability > 0.8) {
    return FaceEmotion.SMILING;
  }

  if (probability > 0.05 && probability < 0.30) {
    return FaceEmotion.SAD;
  }

  return FaceEmotion.NEUTRAL;
}

class EmotionHandler {

  static const ANIMATION_START_SMILE_TIME = 200;
  static const ACCEPT_SMILE_TIME = 2500;
  static const ACCEPT_SMILE_TIME_TOLERANCE = 100;

  int _emotionTimer = 0;
  FaceEmotion _emotion;
  // FaceEmotion _lastEmotion;
  bool _playAnimation = false;
  bool _finished = false;
  bool _dirty = false;

  EmotionHandler();

  void tickEmotion(List<Face> faces) {

    _dirty = false;

    if (_finished == true) return;

    final int now = DateTime.now().millisecondsSinceEpoch;

    if (faces == null || faces.isEmpty) {
      if (_emotion != null) {
        _dirty = true;
      }
      _emotion = null;
      _emotionTimer = 0;
      _playAnimation = false;
      _debug();
      return;
    }

    Face face = faces[0];
    FaceEmotion emotion = getEmotionFromProbability(face.smilingProbability);
    if (emotion != _emotion && now - _emotionTimer >= ACCEPT_SMILE_TIME_TOLERANCE) {
      _emotionTimer = now;
      _emotion = emotion;
      _playAnimation = false;
      _dirty = true;
      _debug(face);
      return;
    }

    final canPlayAnimation = _emotion == FaceEmotion.SMILING || _emotion == FaceEmotion.SAD;
    if (canPlayAnimation && now - _emotionTimer >= ANIMATION_START_SMILE_TIME && _playAnimation == false) {
      _playAnimation = true;
      _dirty = true;
    }

    if (now - _emotionTimer >= ACCEPT_SMILE_TIME) {
      _finished = true;
      _dirty = true;
      _debug(face);
      return;
    }

    _debug();
  }

  void _debug([Face face]) {
    print('************************ EMOTION=$_emotion');
    print('************************ EMOTION.DIRTY=$_dirty');
    print('************************ EMOTION.ANIMATION=$_playAnimation');
    print('************************ EMOTION TIMER=' + (DateTime.now().millisecondsSinceEpoch - _emotionTimer).toString());
    if (face != null) {
      print('************************ EMOTION.FACE.smilingProbability=${face.smilingProbability}');
    }
  }

  FaceEmotion get emotion => _emotion; 
  bool get playAnimation => _playAnimation; 
  bool get finished => _finished;
  bool get dirty => _dirty;
}
