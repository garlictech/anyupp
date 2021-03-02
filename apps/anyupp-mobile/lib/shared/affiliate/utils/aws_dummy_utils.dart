class AwsDummyUtils {

  static const Duration _duration = Duration(minutes: 1);

  static Stream<List<T>> list<T>() {
    return Stream.periodic(_duration, (x) => []);
  }

    static Stream<T> single<T>([T value]) {
    return Stream.periodic(_duration, (x) => value);
  }
}
