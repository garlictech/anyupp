/*
* Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
*
* Licensed under the Apache License, Version 2.0 (the "License").
* You may not use this file except in compliance with the License.
* A copy of the License is located at
*
*  http://aws.amazon.com/apache2.0
*
* or in the "license" file accompanying this file. This file is distributed
* on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
* express or implied. See the License for the specific language governing
* permissions and limitations under the License.
*/

// ignore_for_file: public_member_api_docs

import 'package:amplify_datastore_plugin_interface/amplify_datastore_plugin_interface.dart';
import 'Address.dart';
import 'ChainStyle.dart';
import 'ChainStyleColors.dart';
import 'ChainStyleImages.dart';
import 'FavoriteProduct.dart';
import 'GeneratedProduct.dart';
import 'GeoUnit.dart';
import 'LocalizedItem.dart';
import 'Location.dart';
import 'Order.dart';
import 'OrderItem.dart';
import 'PaymentMode.dart';
import 'Place.dart';
import 'PriceShown.dart';
import 'ProductCategory.dart';
import 'ProductVariant.dart';
import 'ProductVariantPack.dart';
import 'StatusLog.dart';
import 'User.dart';

export 'Address.dart';
export 'ChainStyle.dart';
export 'ChainStyleColors.dart';
export 'ChainStyleImages.dart';
export 'FavoriteProduct.dart';
export 'GeneratedProduct.dart';
export 'GeoUnit.dart';
export 'LocalizedItem.dart';
export 'Location.dart';
export 'Order.dart';
export 'OrderItem.dart';
export 'PaymentMode.dart';
export 'Place.dart';
export 'PriceShown.dart';
export 'ProductCategory.dart';
export 'ProductVariant.dart';
export 'ProductVariantPack.dart';
export 'StatusLog.dart';
export 'User.dart';

class ModelProvider implements ModelProviderInterface {
  @override
  String version = "47fcb25a3d97eea387b127100fbbe5da";
  @override
  List<ModelSchema> modelSchemas = [
    Address.schema,
    ChainStyle.schema,
    ChainStyleColors.schema,
    ChainStyleImages.schema,
    FavoriteProduct.schema,
    GeneratedProduct.schema,
    GeoUnit.schema,
    LocalizedItem.schema,
    Location.schema,
    Order.schema,
    OrderItem.schema,
    PaymentMode.schema,
    Place.schema,
    PriceShown.schema,
    ProductCategory.schema,
    ProductVariant.schema,
    ProductVariantPack.schema,
    StatusLog.schema,
    User.schema
  ];
  static final ModelProvider _instance = ModelProvider();

  static ModelProvider get instance => _instance;

  ModelType getModelTypeByModelName(String modelName) {
    switch (modelName) {
      case "Address":
        {
          return Address.classType;
        }
        break;
      case "ChainStyle":
        {
          return ChainStyle.classType;
        }
        break;
      case "ChainStyleColors":
        {
          return ChainStyleColors.classType;
        }
        break;
      case "ChainStyleImages":
        {
          return ChainStyleImages.classType;
        }
        break;
      case "FavoriteProduct":
        {
          return FavoriteProduct.classType;
        }
        break;
      case "GeneratedProduct":
        {
          return GeneratedProduct.classType;
        }
        break;
      case "GeoUnit":
        {
          return GeoUnit.classType;
        }
        break;
      case "LocalizedItem":
        {
          return LocalizedItem.classType;
        }
        break;
      case "Location":
        {
          return Location.classType;
        }
        break;
      case "Order":
        {
          return Order.classType;
        }
        break;
      case "OrderItem":
        {
          return OrderItem.classType;
        }
        break;
      case "PaymentMode":
        {
          return PaymentMode.classType;
        }
        break;
      case "Place":
        {
          return Place.classType;
        }
        break;
      case "PriceShown":
        {
          return PriceShown.classType;
        }
        break;
      case "ProductCategory":
        {
          return ProductCategory.classType;
        }
        break;
      case "ProductVariant":
        {
          return ProductVariant.classType;
        }
        break;
      case "ProductVariantPack":
        {
          return ProductVariantPack.classType;
        }
        break;
      case "StatusLog":
        {
          return StatusLog.classType;
        }
        break;
      case "User":
        {
          return User.classType;
        }
        break;
      default:
        {
          throw Exception(
              "Failed to find model in model provider for model name: " +
                  modelName);
        }
    }
  }
}
