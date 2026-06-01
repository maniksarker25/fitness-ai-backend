export type TLoginUser = {
  email: string;
  password: string;
  playerId?: string;
  platform?: "ios" | "android" | "web";
};
