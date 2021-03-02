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
import 'Chain.dart';
import 'ChainStyle.dart';
import 'ChainStyleColors.dart';
import 'ChainStyleImages.dart';
import 'DailySchedule.dart';
import 'FavoriteProduct.dart';
import 'Group.dart';
import 'LocalizedItem.dart';
import 'Location.dart';
import 'Order.dart';
import 'OrderItem.dart';
import 'PaymentMode.dart';
import 'Place.dart';
import 'PriceShown.dart';
import 'Product.dart';
import 'ProductCategory.dart';
import 'ProductVariant.dart';
import 'ProductVariantPack.dart';
import 'StatusLog.dart';
import 'Unit.dart';
import 'User.dart';
import 'WeeklySchedule.dart';

export 'Address.dart';
export 'Chain.dart';
export 'ChainStyle.dart';
export 'ChainStyleColors.dart';
export 'ChainStyleImages.dart';
export 'DailySchedule.dart';
export 'FavoriteProduct.dart';
export 'Group.dart';
export 'LocalizedItem.dart';
export 'Location.dart';
export 'Order.dart';
export 'OrderItem.dart';
export 'PaymentMode.dart';
export 'Place.dart';
export 'PriceShown.dart';
export 'Product.dart';
export 'ProductCategory.dart';
export 'ProductVariant.dart';
export 'ProductVariantPack.dart';
export 'StatusLog.dart';
export 'Unit.dart';
export 'User.dart';
export 'WeeklySchedule.dart';

class ModelProvider implements ModelProviderInterface {
  @override
  String version = "411b2aaee962bcef6a8474f91321e821";
  @override
  List<ModelSchema> modelSchemas = [
    Address.schema,
    Chain.schema,
    ChainStyle.schema,
    ChainStyleColors.schema,
    ChainStyleImages.schema,
    DailySchedule.schema,
    FavoriteProduct.schema,
    Group.schema,
    LocalizedItem.schema,
    Location.schema,
    Order.schema,
    OrderItem.schema,
    PaymentMode.schema,
    Place.schema,
    PriceShown.schema,
    Product.schema,
    ProductCategory.schema,
    ProductVariant.schema,
    ProductVariantPack.schema,
    StatusLog.schema,
    Unit.schema,
    User.schema,
    WeeklySchedule.schema
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
      case "Chain":
        {
          return Chain.classType;
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
      case "DailySchedule":
        {
          return DailySchedule.classType;
        }
        break;
      case "FavoriteProduct":
        {
          return FavoriteProduct.classType;
        }
        break;
      case "Group":
        {
          return Group.classType;
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
      case "Product":
        {
          return Product.classType;
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
      case "Unit":
        {
          return Unit.classType;
        }
        break;
      case "User":
        {
          return User.classType;
        }
        break;
      case "WeeklySchedule":
        {
          return WeeklySchedule.classType;
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
