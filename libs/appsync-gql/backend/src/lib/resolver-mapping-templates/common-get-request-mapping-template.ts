export const commonGetRequestMappingTemplate = `
{
  "version": "2017-02-28",
  "operation": "GetItem",
  "key":  {
    "id" : { "S" : "\${context.arguments.id}" }
  }
}
`;
