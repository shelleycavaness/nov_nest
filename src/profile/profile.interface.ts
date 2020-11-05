export interface ProfileData {
  username: string;
  image?: string;
}

export interface ProfileRO {
  profile: ProfileData;
}