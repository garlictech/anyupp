import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import 'package:fa_prev/shared/face/model/face_exception.dart';
import 'package:fa_prev/shared/face/preferences/face_preferences.dart';
import 'package:fa_prev/shared/face/utils/detection_counter.dart';
import 'package:fa_prev/shared/face/repository/face_repository.dart';

import 'face_detection_event.dart';
import 'face_detection_state.dart';

class FaceDetectionBloc extends Bloc<FaceDetectionEvent, FaceDetectionState> {
  final FaceRepository _faceRepository;

  FaceDetectionBloc(this._faceRepository) : super(NoFaceDetectedState());

  /// Counter for recognitions.
  DetectionCounter _counter;

  @override
  Stream<FaceDetectionState> mapEventToState(FaceDetectionEvent event) async* {
    // print('**** FaceDetectionBloc.mapEventToState=$event');
    try {
      if (event is StopFaceRecognition) {
        await _faceRepository.stopDetection();
        return;
      }

      if (event is StartAgeAndGenderDetections) {
        if (!event.force && await genderAndAgeAlreadyDetected()) {
           print('**** FaceDetectionBloc. Skipping detection, already detected!');
          return;
        }
        add(StartGenderDetection());
        return;
      }
      if (event is StartGenderDetection) {
        _checkDetectionAlreadyRunningError();

        _counter = DetectionCounter(
          countToPass: 5, // the winner need 10 times to match...
          minConfidenceToIncCount: 0.8, // ...at least 80% percent confidence
        );

        yield FaceDetectionCurrentState(DetectionStates.DetectingGender);
        await _faceRepository.startDetection(
          snapshotIntervallMs: 500, // Check snapshot every 1 sec
          modelPath: 'assets/models/zenbojunior_gender.tflite', // Tensor model to use for detection
          labelPath:
              'assets/models/zenbojunior_gender.txt', // Tensor label file containing the possible labels of the detection (male, female)
          onDetection: (recognitions) async {
            if (recognitions != null) {
              print('**** FaceDetectionBloc.GENDER DETECTION RESULT=$recognitions');
              _counter.addRecognitionResultList(recognitions);
              if (_counter.isPassed) {
                print('***** FaceDetectionBloc.GENDER_FOUND=${_counter.passed}');
                await FacePreferences.setGender(_counter.passed.label);
                await _faceRepository.stopDetection();
                // yield FaceDetectionCurrentState(DetectionStates.DetectingGenderFinished);
                add(StartAgeDetection());
              }
            }
          },
        );
      }

      if (event is StartAgeDetection) {
        _checkDetectionAlreadyRunningError();
        _counter = DetectionCounter(
          countToPass: 4, // the winner need 10 times to match...
          minConfidenceToIncCount: 0.8, // ...at least 80% percent confidence
        );
        yield FaceDetectionCurrentState(DetectionStates.DetectingAge);
        await _faceRepository.startDetection(
          snapshotIntervallMs: 250,
          modelPath: 'assets/models/zenbojunior_age.tflite',
          labelPath: 'assets/models/zenbojunior_age.txt',
          onDetection: (recognitions) async {
            if (recognitions != null) {
              print('**** FaceDetectionBloc.AGE DETECTION RESULT=$recognitions');
              _counter.addRecognitionResultList(recognitions);
              if (_counter.isPassed) {
                print('***** FaceDetectionBloc.AGE_FOUND=${_counter.passed}');
                await FacePreferences.setAge(_counter.passed.label);
                await _faceRepository.stopDetection();
                await _faceRepository.dispose();
                // yield FaceDetectionCurrentState(DetectionStates.DetectingAgeFinished);
              }
            }
          },
        );
      }
    } on PlatformException catch (e) {
      print('**** FaceDetectionBloc.error=$e');
      yield FaceDetectionError(FaceException.fromPlatformException(e));
    } on Exception catch (e) {
      print('**** FaceDetectionBloc.error=$e');
      yield FaceDetectionError(FaceException.fromException(FaceException.UNKNOWN_ERROR, e));
    }
  }

  void _checkDetectionAlreadyRunningError() {
    if (_faceRepository.isDetectionRunning) {
      throw FaceException(
        code: FaceException.FACE_DETECTION_ALREADY_RUNNING,
        message: 'Some detection already running.',
        details: 'Check the code because the detection has been started multiple times.',
      );
    }
  }

  Future<bool> genderAndAgeAlreadyDetected() async {
    return await FacePreferences.getAge() != null && await FacePreferences.getGender() != null;
  }
}
