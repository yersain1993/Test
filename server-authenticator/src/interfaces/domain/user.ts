export interface User {
  email: string;
  passwordHash: string;
}

export interface AuthenticatedUser {
  email: string;
}
