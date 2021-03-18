class DetectionRecord {
  String label;
  int count;
  double maxConfidence;
  double avgConfidence;
  DetectionRecord({
    this.label,
    this.count,
    this.maxConfidence,
    this.avgConfidence,
  });
  @override
  String toString() => 'DetectionRecord(label: $label, count: $count, maxConfidence: $maxConfidence, avgConfidence: $avgConfidence)';
}

/// Helper class to count the successfully recognitions and pass the first who win the race.
/// The best recognition 'label' added to the counter and if the 'label' count reach specified number then
/// the recognition finished with this 'label'.
class DetectionCounter {
  Map<String, DetectionRecord> _labelCountMap;

  final double minConfidenceToIncCount;
  final int countToPass;

  DetectionRecord _passed;

  DetectionCounter({
    this.minConfidenceToIncCount,
    this.countToPass,
  }) {
    reset();
  }


  /// Reset the counter to initial state (all labels are 0 count and 0 confidence)
  void reset() {
    _labelCountMap = Map();
    _passed = null;
  }

  void addRecognitionResultList(List<dynamic> recognition) {
    recognition.forEach((recognition) => addRecognitionResult(recognition));
  }

  /// Add tflite recognition result to the counter.
  /// recognition map is come from tflite, and has the following keys: 'label', 'index', 'confidence'
  /// We use only the confidence and the label parameter to calculate the count of pass
  void addRecognitionResult(Map<dynamic, dynamic> map) {
    if (map == null || isPassed) return;
    String label = map['label'];
    double confidence = map['confidence'];
    if (confidence >= minConfidenceToIncCount) {
      if (_labelCountMap[label] == null) {
        _labelCountMap[label] = DetectionRecord(
          label: label,
          count: 0,
          avgConfidence: confidence,
          maxConfidence: confidence,
        );
      }
      _labelCountMap[label].count++;
      if (_labelCountMap[label].maxConfidence < confidence) {
        _labelCountMap[label].maxConfidence = confidence;
      }
      if (_labelCountMap[label].count >= countToPass) {
        _passed = _labelCountMap[label];
      }
    }
  }

  /// Return true if any of the recognitions passed with 'minConfidenceToIncCount' confidence 'countToPass' times.
  bool get isPassed => _passed != null;

  /// If isPassed is true this value contains the passed recognition, with 'label', 'maxConfidence' and 'avgConfidence'
  DetectionRecord get passed => _passed;
}
