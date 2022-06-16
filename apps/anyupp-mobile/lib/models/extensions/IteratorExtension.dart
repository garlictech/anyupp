import 'dart:collection';

extension Iterables<E> on Iterable<E> {
  LinkedHashMap<K, List<E>> groupBy<K>(K Function(E) keyFunction) => fold(
      LinkedHashMap<K, List<E>>(),
      (LinkedHashMap<K, List<E>> map, E element) =>
          map..putIfAbsent(keyFunction(element), () => <E>[]).add(element));
}
