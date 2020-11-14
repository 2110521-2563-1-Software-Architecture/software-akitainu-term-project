export enum LoginType {
  facebook,
  google,
}
export class userDto {
  userId: string;
  userName: string;
  userRank: number;
  userLevel: number;
  userExp: number;
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

export class UserProgressDto {
  userExp: number;
  userRank?: number;
  userLevel: number;
}

export class EditUserDto {
  userId: string;
  userRank?: number;
  userExp?: number;
  userLevel?: number;
  userName?: string;
}
