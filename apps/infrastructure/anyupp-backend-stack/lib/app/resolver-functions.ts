import {
  AppsyncFunction,
  MappingTemplate,
  NoneDataSource
} from '@aws-cdk/aws-appsync';

const urlValidator =
  '"^(?:(?:(?:https?|ftp):)?\\/\\/)(?:\\S+(?::\\S*)?@)?(?:(?!(?:10|127)(?:\\.\\d{1,3}){3})(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z0-9\\u00a1-\\uffff][a-z0-9\\u00a1-\\uffff_-]{0,62})?[a-z0-9\\u00a1-\\uffff]\\.)+(?:[a-z\\u00a1-\\uffff]{2,}\\.?))(?::\\d{2,5})?(?:[/?#]\\S*)?"';

export interface ResolverFunctions {
  validateLon: AppsyncFunction;
  validateLat: AppsyncFunction;
  validateUrl: AppsyncFunction;
  validateAddress: AppsyncFunction;
}

export const createResolverFunctions = (
  noneDs: NoneDataSource
): ResolverFunctions => ({
  validateLon: noneDs.createFunction({
    name: 'validateLon',
    description: 'Validate a longitude',
    requestMappingTemplate: MappingTemplate.fromString(`
        #set($valid = $util.isNull($object.url) or ($ctx.stash.lon <= 180.0) and ($ctx.stash.lon >= -180.0))
        #if (!$valid)
            $util.error("$ctx.stash.lon is not a valid longitude.")
        #end
        {}
      `),
    responseMappingTemplate: MappingTemplate.fromFile(
      'lib/appsync/graphql-api/mapping-templates/common-response-mapping-template.vtl'
    )
  }),

  validateLat: noneDs.createFunction({
    name: 'validateLat',
    description: 'Validate a latitude',
    requestMappingTemplate: MappingTemplate.fromString(`
        #set($valid = $util.isNull($object.url) or ($ctx.stash.lat <= 90.0) and ($ctx.stash.lat >= -90.0))
        #if (!$valid)
            $util.error("$ctx.stash.lat is not a valid latitude.")
        #end
        {}
      `),
    responseMappingTemplate: MappingTemplate.fromFile(
      'lib/appsync/graphql-api/mapping-templates/common-response-mapping-template.vtl'
    )
  }),

  validateAddress: noneDs.createFunction({
    name: 'validateAddress',
    description: 'Validate an address',
    requestMappingTemplate: MappingTemplate.fromString(`
        #set($valid = 
             ($util.isNull($ctx.stash.address.location.lng) and $util.isNull($ctx.stash.address.location.lat)) or 
             (($ctx.stash.address.location.lat <= 90.0) and ($ctx.stash.address.location.lat >= -90.0) and
             ($ctx.stash.address.location.lng <= 180.0) and ($ctx.stash.address.location.lng >= -180.0)
             ))
        #if (!$valid)
            $util.error("$ctx.stash.address is not a valid address")
        #end
        {} 
      `),
    responseMappingTemplate: MappingTemplate.fromFile(
      'lib/appsync/graphql-api/mapping-templates/common-response-mapping-template.vtl'
    )
  }),

  validateUrl: noneDs.createFunction({
    name: 'validateUrl',
    description: 'Validate an url',
    requestMappingTemplate: MappingTemplate.fromString(`
        #set($valid = $util.matches(${urlValidator}, $ctx.stash.url))
        #if (!$valid)
            $util.error("$ctx.stash.url is not a valid ur.")
        #end
        {}
      `),
    responseMappingTemplate: MappingTemplate.fromFile(
      'lib/appsync/graphql-api/mapping-templates/common-response-mapping-template.vtl'
    )
  })
});
