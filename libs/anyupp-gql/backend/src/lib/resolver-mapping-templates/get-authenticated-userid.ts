export const getAuthenticatedUserIdFromContextIdentity =
  '$util.toJson($util.defaultIfNull($ctx.identity.claims.get("cognito:username"),$ctx.identity.claims.get("username")))';
