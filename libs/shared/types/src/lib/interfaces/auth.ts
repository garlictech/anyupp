export interface AuthenticatedCognitoUser {
  user?: {
    id?: string;
    email?: string;
    role?: string;
  };
}
