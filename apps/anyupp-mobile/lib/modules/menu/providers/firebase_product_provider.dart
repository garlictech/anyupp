import 'package:catcher/catcher.dart';
import 'package:fa_prev/modules/menu/menu.dart';
import 'package:fa_prev/shared/models.dart';
import 'package:fa_prev/shared/utils/firebase_model_mapper.dart';
import 'package:firebase_database/firebase_database.dart';
import 'package:rxdart/rxdart.dart';

class FirebaseProductProvider implements IProductProvider {
  final DatabaseReference _dbRef;

  FirebaseProductProvider(this._dbRef);

  @override
  Stream<List<ProductCategory>> getProductCategoryList(String chainId, String unitId) {
    return _dbRef
        .child('productCategories')
        .child('chains')
        .child(chainId)
        .onValue
        .map((event) => event.snapshot)
        //.where((snapshot) => snapshot.value != null)
        .map(FirebaseModelMapper.snapshotToProductCategories)
        .switchMap((categories) => getNotEmptyProductCategoryList(unitId).map(
            (notEmptyCategories) => categories.where((element) => notEmptyCategories.contains(element.id)).toList()))
        .handleError(onError);
  }

  @override
  Stream<List<String>> getNotEmptyProductCategoryList(String unitId) {
    return _dbRef
        .child('generated')
        .child('productCategoryList')
        .child('units')
        .child(unitId)
        .child('productCategories')
        .onValue
        .map((event) => event.snapshot)
        //.where((snapshot) => snapshot.value != null)
        .map(FirebaseModelMapper.snapshotToNotEmptyProductCategories)
        .handleError(onError);
  }

  @override
  Stream<List<Product>> getProductList(String unitId, String categoryId) {
    return _dbRef
        .child('generated')
        .child('productList')
        .child('units')
        .child(unitId)
        .child('productCategories')
        .child(categoryId)
        .child('products')
        .onValue
        .map((event) => event.snapshot)
        // .doOnEach((event) => print('***** getProductList.onvalue: $event'))
        // .where((snapshot) => snapshot.value != null)
        .map((productList) => FirebaseModelMapper.snapshotToProducts(categoryId, productList))
        .handleError(onError);
  }
}

onError(error, stackTrace) {
  Catcher.reportCheckedError(error, stackTrace);
}
