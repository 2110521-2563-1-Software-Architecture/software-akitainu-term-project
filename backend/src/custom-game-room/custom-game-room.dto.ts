export class CustomGameRoomDto {
  roomId: string;
  usersId: string[];
}

export class CreatedIdCustomGameRoomDto {
  roomId: string;
  userId: string;
}

export class NewUserJoinCustomRoomDto {
  userId: string;
  roomId: string;
}
