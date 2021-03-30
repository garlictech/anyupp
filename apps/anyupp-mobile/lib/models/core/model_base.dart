abstract class Model {
  final String id;

  const Model({this.id});

  String getId() {
    return id;
  }

  Map<String, dynamic> toJson();
}
