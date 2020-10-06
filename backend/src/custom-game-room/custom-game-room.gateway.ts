import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { CreatedIdCustomGameRoomDto } from './custom-game-room.dto';
import { CustomGameRoomService } from './custom-game-room.service';
import { ChatService } from './chat.service';

type OnGatewayInterface = OnGatewayConnection & OnGatewayDisconnect;

@WebSocketGateway(10001)
export class CustomGameRoomGateway implements OnGatewayInterface {
  constructor(
    private readonly customGameRoomService: CustomGameRoomService,
    private readonly chatService: ChatService,
  ) {}

  @WebSocketServer() server;
  users = 0;

  async handleConnection(socket: Socket) {
    console.log('[New User] :\t', socket.id);
  }

  async handleDisconnect(socket: Socket) {
    console.log('[User disconnected]: \t', socket.id);
  }

  @SubscribeMessage('create-custom-room')
  async onCreateCustomRoom(socket: Socket, data: any) {
    const userId = data.userId;
    console.log('[userId] :\t', userId, 'sent from', socket.id);

    const roomId = await this.customGameRoomService.createCustomRoom(userId);
    socket.join(roomId);

    const newCustomGameRoom: CreatedIdCustomGameRoomDto = {
      roomId,
      userId,
    };

    console.log('[CustomGameRoomCreated] :\t', roomId);
    this.server.emit('new-custom-room', newCustomGameRoom);
  }

  @SubscribeMessage('join-custom-room')
  async onJoinCustomRoom(socket: Socket, data: any) {
    const userId = data.userId;
    const roomId = data.roomId;
    console.log('[userId] :\t', userId, ' [roomId] :', roomId);

    socket.join(roomId);
    const allUsersInRoom = await this.customGameRoomService.joinCustomRoom({
      userId,
      roomId,
    });

    const newJoinedUserName = await this.customGameRoomService.getJoinedUserName(
      userId,
    );

    const newJoinedUser = {
      userId,
      userName: newJoinedUserName,
      roomId,
    };

    this.server.to(roomId).emit('new-join-custom-other', newJoinedUser);

    this.server.emit('new-join-custom-joiner', allUsersInRoom);
  }

  @SubscribeMessage('start-game')
  async onStartGame(socket: Socket, data: any) {
    const { roomId } = data;
    const newGame = await this.customGameRoomService.initializeDeck(roomId);

    console.log('newGame: ', newGame);

    this.server.to(roomId).emit('new-game', newGame);
  }

  @SubscribeMessage('draw-card')
  async onDrawCard(socket: Socket, data: any) {
    const { roomId, userId } = data;
    const newCard = await this.customGameRoomService.drawCard(userId, roomId);

    console.log('newCard: ', newCard);

    this.server.to(roomId).emit('new-card', newCard);
  }

  @SubscribeMessage('use-card')
  async onUseCard(socket: Socket, data: any) {
    const { roomId, userId, card, cardIdx } = data;
    const newCardUse = await this.customGameRoomService.useCard(
      userId,
      roomId,
      card,
      cardIdx,
    );

    this.server.to(roomId).emit('new-card-use', newCardUse);
  }

  @SubscribeMessage('use-favor')
  async onUseFavor(socket: Socket, data: any) {
    const { roomId } = data;
    this.server.to(roomId).emit('new-favor', data);
  }

  @SubscribeMessage('select-favor-card')
  async onSelectFavor(socket: Socket, data: any) {
    const { roomId, userId, card } = data;
    this.server.to(roomId).emit('receive-favor-card', { roomId, userId, card });
  }

  @SubscribeMessage('use-see-the-future')
  async onSeeTheFuture(socket: Socket, data: any) {
    const { roomId, userId } = data;
    const newSeeTheFuture = await this.customGameRoomService.seeTheFuture(
      userId,
      roomId,
    );
    this.server.to(roomId).emit('new-see-the-future', newSeeTheFuture);
  }

  @SubscribeMessage('use-common-2')
  async onUseCommon2(socket: Socket, data: any) {
    const { roomId } = data;
    this.server.to(roomId).emit('new-common-2', data);
  }

  @SubscribeMessage('select-common-2')
  async onSelectCommon2(socket: Socket, data: any) {
    const { roomId } = data;
    this.server.to(roomId).emit('receive-common-2', data);
  }

  @SubscribeMessage('use-common-3')
  async onUseCommon3(socket: Socket, data: any) {
    const { roomId } = data;
    this.server.to(roomId).emit('new-common-3', data);
  }

  @SubscribeMessage('select-common-3')
  async onSelectCommon3(socket: Socket, data: any) {
    const { roomId } = data;
    this.server.to(roomId).emit('receive-common-3', data);
  }

  @SubscribeMessage('use-common-5')
  async onUseCommon5(socket: Socket, data: any) {
    const { roomId } = data;
    this.server.to(roomId).emit('new-common-5', data);
  }

  @SubscribeMessage('select-common-5')
  async onSelectCommon5(socket: Socket, data: any) {
    const { roomId } = data;
    this.server.to(roomId).emit('receive-common-5', data);
  }

  // chat service
  @SubscribeMessage('message-send-room')
  async onSendMessageRoom(socket: Socket, data: any) {
    const { fromRoomId } = data;
    this.server.to(fromRoomId).emit('message-get-room', data);
  }

  @SubscribeMessage('message-send-private')
  async onSendMessagePrivate(socket: Socket, data: any) {
    this.server.emit('message-get-private', data);
  }
}
