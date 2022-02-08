export type AmplifyDependentResourcesAttributes = {
  storage: {
    anyuppstorage: {
      BucketName: 'string';
      Region: 'string';
    };
  };
  api: {
    anyuppbackend: {
      GraphQLAPIIdOutput: 'string';
      GraphQLAPIEndpointOutput: 'string';
    };
  };
};
