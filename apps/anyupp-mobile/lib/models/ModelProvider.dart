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
import 'AdminRoleEntity.dart';
import 'AdminUser.dart';
import 'AdminUserRole.dart';
import 'AdminUserSettings.dart';
import 'Availability.dart';
import 'CardChecks.dart';
import 'Chain.dart';
import 'ChainProduct.dart';
import 'ChainStyle.dart';
import 'ChainStyleColors.dart';
import 'ChainStyleImages.dart';
import 'FavoriteProduct.dart';
import 'Group.dart';
import 'Lane.dart';
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
import 'StripeCard.dart';
import 'StripeMetadata.dart';
import 'Unit.dart';
import 'User.dart';

export 'Address.dart';
export 'AdminRoleEntity.dart';
export 'AdminUser.dart';
export 'AdminUserRole.dart';
export 'AdminUserSettings.dart';
export 'Availability.dart';
export 'CardBrand.dart';
export 'CardChecks.dart';
export 'CardFundingType.dart';
export 'Chain.dart';
export 'ChainProduct.dart';
export 'ChainStyle.dart';
export 'ChainStyleColors.dart';
export 'ChainStyleImages.dart';
export 'FavoriteProduct.dart';
export 'Group.dart';
export 'Lane.dart';
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
export 'StripeCard.dart';
export 'StripeMetadata.dart';
export 'Unit.dart';
export 'User.dart';

class ModelProvider implements ModelProviderInterface {
  @override
  String version = "e05cf115b3949092b6b0c8689e29adcc";
  @override
  List<ModelSchema> modelSchemas = [
    Address.schema,
    AdminRoleEntity.schema,
    AdminUser.schema,
    AdminUserRole.schema,
    AdminUserSettings.schema,
    Availability.schema,
    CardChecks.schema,
    Chain.schema,
    ChainProduct.schema,
    ChainStyle.schema,
    ChainStyleColors.schema,
    ChainStyleImages.schema,
    FavoriteProduct.schema,
    Group.schema,
    Lane.schema,
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
    StripeCard.schema,
    StripeMetadata.schema,
    Unit.schema,
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
      case "AdminRoleEntity":
        {
          return AdminRoleEntity.classType;
        }
        break;
      case "AdminUser":
        {
          return AdminUser.classType;
        }
        break;
      case "AdminUserRole":
        {
          return AdminUserRole.classType;
        }
        break;
      case "AdminUserSettings":
        {
          return AdminUserSettings.classType;
        }
        break;
      case "Availability":
        {
          return Availability.classType;
        }
        break;
      case "CardChecks":
        {
          return CardChecks.classType;
        }
        break;
      case "Chain":
        {
          return Chain.classType;
        }
        break;
      case "ChainProduct":
        {
          return ChainProduct.classType;
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
      case "Group":
        {
          return Group.classType;
        }
        break;
      case "Lane":
        {
          return Lane.classType;
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
      case "StripeCard":
        {
          return StripeCard.classType;
        }
        break;
      case "StripeMetadata":
        {
          return StripeMetadata.classType;
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
      default:
        {
          throw Exception(
              "Failed to find model in model provider for model name: " +
                  modelName);
        }
    }
  }
}
