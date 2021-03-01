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
import 'Group.dart';
import 'LocalizedItem.dart';
import 'Location.dart';
import 'PaymentMode.dart';
import 'Unit.dart';

export 'Address.dart';
export 'Chain.dart';
export 'ChainStyle.dart';
export 'ChainStyleColors.dart';
export 'ChainStyleImages.dart';
export 'Group.dart';
export 'LocalizedItem.dart';
export 'Location.dart';
export 'PaymentMode.dart';
export 'Unit.dart';

class ModelProvider implements ModelProviderInterface {
  @override
  String version = "3ced7ea99aa92621ef715f9d1ac858f6";
  @override
  List<ModelSchema> modelSchemas = [
    Address.schema,
    Chain.schema,
    ChainStyle.schema,
    ChainStyleColors.schema,
    ChainStyleImages.schema,
    Group.schema,
    LocalizedItem.schema,
    Location.schema,
    PaymentMode.schema,
    Unit.schema
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
      case "PaymentMode":
        {
          return PaymentMode.classType;
        }
        break;
      case "Unit":
        {
          return Unit.classType;
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
