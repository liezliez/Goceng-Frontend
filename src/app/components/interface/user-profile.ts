export interface UserProfile {
  id: string;
  name: string;
  email: string;
  account_status: string;
  role: { id: number; roleName: string };
  branch: { id: string; name: string };
  employee: { id: string; name: string };
}
export interface UserProfileResponse {
  user: UserProfile;
  token: string;
  refreshToken: string;
  expiresAt: number;
  features: string[];
}
