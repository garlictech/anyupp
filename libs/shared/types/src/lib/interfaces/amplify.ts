export interface IAmplifyApiConfig extends Record<string, unknown> {
  aws_appsync_graphqlEndpoint: string;
  aws_appsync_region: string;
  aws_user_pools_id: string;
  aws_user_pools_web_client_id: string;
  aws_appsync_apiKey: string;
}

export interface IAmplifyModel {
  createdAt?: number;
  updatedAt?: number;
}

export interface IStorageResponse {
  key: string;
}
