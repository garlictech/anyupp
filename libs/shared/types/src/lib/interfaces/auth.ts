export interface IAuthenticatedCognitoUser {
  user?: {
    id?: string;
    email?: string;
    role?: string;
  };
}
