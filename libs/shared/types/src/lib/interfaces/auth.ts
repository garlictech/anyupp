export interface IAuthenticatedCognitoUser {
  token?: string;
  user?: {
    id?: string;
    email?: string;
  };
}
