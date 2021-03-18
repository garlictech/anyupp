abstract class IFunctionProvider {

  Future<T> call<T>(String name, Map params);
}
