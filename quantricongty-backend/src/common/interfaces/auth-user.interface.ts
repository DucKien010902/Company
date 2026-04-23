export interface AuthUser {
  sub: string;
  email: string;
  permissions: string[];
  roleIds: string[];
}
