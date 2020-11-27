export enum LoginType {
  facebook,
  google,
}

export enum GameMode {
  rank = 'rank',
  custom = 'custom',
}

export class userDto {
  userId: string;
  userName: string;
  userRank: number;
  userLevel: number;
  userExp: number;
  winRate: number;
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
  rankGameWinMatches: number;
  rankGameMatches: number;
}

export class EditUserDto {
  userId: string;
  userRank?: number;
  userExp?: number;
  userLevel?: number;
  userName?: string;
  rankGameWinMatches?: number;
  rankGameMatches?: number;
}
