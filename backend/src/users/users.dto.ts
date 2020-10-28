export enum LoginType {
  facebook,
  google,
}
export class userDto {
  userId: string;
  userName: string;
  userRank: number;
  userLevel: number;
}

export class newUserDto {
  userName: string;
  snsId: string;
  loginType: LoginType;
}

export class loginUserDto {
  snsId: string;
  loginType: LoginType;
}
