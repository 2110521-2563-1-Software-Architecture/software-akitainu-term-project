import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { Card, CreatedIdCustomGameRoomDto } from './game.dto';
import { GameService } from './game.service';

type OnGatewayInterface = OnGatewayConnection & OnGatewayDisconnect;

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
const socket_port = parseInt(process.env.SOCKET_SERVER) || 10001;
@WebSocketGateway(socket_port)
export class GameGateway implements OnGatewayInterface {
  constructor(private readonly customGameRoomService: GameService) {}

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
    const isAlreadyJoin = await this.customGameRoomService.isAlreadyJoin(
      userId,
      roomId,
    );
    if (isAlreadyJoin) return;

    socket.join(roomId);
    const allUsersInRoom = await this.customGameRoomService.joinCustomRoom({
      userId,
      roomId,
    });
    if (!allUsersInRoom) return; // cant join started room
    console.log('allUsersInRoom', allUsersInRoom);

    // Todo: add userName in request
    const newJoinedUserName = '';

    const newJoinedUser = {
      userId,
      userName: newJoinedUserName,
      roomId,
    };

    this.server.to(roomId).emit('new-join-custom-other', newJoinedUser);

    this.server.emit('new-join-custom-joiner', allUsersInRoom);
  }

  async onStartGame(data: any) {
    const { roomId } = data;
    const newGame = await this.customGameRoomService.onStartGame(roomId);

    console.log('newGame: ', newGame);
    console.log("starting")

    // this.server.to(roomId).emit('new-game', newGame);
    this.server.emit('new-game', newGame);
    // setTimeout(()=>{
    //   this.server.emit('new-game', newGame);
    // },5000)
  }

  @SubscribeMessage('draw-card')
  async onDrawCard(socket: Socket, data: any) {
    const { roomId, userId } = data;
    const newCard = await this.customGameRoomService.drawCard(userId, roomId);
    console.log('newCard: ', newCard);
    if (newCard !== false) {
      this.server.to(roomId).emit('new-card', newCard);
    }
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

  // @SubscribeMessage('use-favor')
  // async onUseFavor(socket: Socket, data: any) {
  //   const { roomId } = data;
  //   this.server.to(roomId).emit('new-favor', data);
  // }

  @SubscribeMessage('select-player')
  async onSelectPlayer(socket: Socket, data: any) {
    const { roomId } = data;
    this.server.to(roomId).emit('new-select', data);
  }

  // @SubscribeMessage('use-see-the-future')
  // async onSeeTheFuture(socket: Socket, data: any) {
  //   const { roomId, userId } = data;
  //   const newSeeTheFuture = await this.customGameRoomService.seeTheFuture(
  //     userId,
  //     roomId,
  //   );
  //   this.server.to(roomId).emit('new-see-the-future', newSeeTheFuture);
  // }

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

  @SubscribeMessage('draw-exploding-puppy')
  async onDrawExplodingPuppy(socket: Socket, data: any) {
    const { roomId } = data;
    this.server.to(roomId).emit('new-exploding-puppy', data);
  }

  @SubscribeMessage('insert-exploding-puppy')
  async onInsertExplodingPuppy(socket: Socket, data: any) {
    const { roomId, userId, idx } = data;
    const nextUserId = await this.customGameRoomService.insertExplodingPuppy(
      roomId,
      idx,
    );
    this.server
      .to(roomId)
      .emit('finish-exploding-puppy', { roomId, userId, nextUserId });
  }

  @SubscribeMessage('game-lose')
  async onGameLose(socket: Socket, data: any) {
    const { roomId, userId } = data;
    const loseResult = await this.customGameRoomService.loseGame(
      roomId,
      userId,
      false,
    );
    if (!loseResult) return; // Error : player already die
    this.server.to(roomId).emit('new-lose', { ...data, ...loseResult });

    const result = await this.customGameRoomService.resultGame(roomId);
    if (result) {
      this.server.to(roomId).emit('new-win', { result });
    }
  }

  @SubscribeMessage('use-effect')
  async onUseEffect(socket: Socket, data: any) {
    const { roomId, card } = data;
    let effectCard;
    switch (card) {
      case Card.seeTheFuture: {
        effectCard = 'seeTheFutureCards';
        break;
      }
      case Card.shuffle: {
        effectCard = 'shuffleCards';
        break;
      }
      case Card.favor: {
        effectCard = 'favorCard';
        break;
      }
      case Card.attack: {
        effectCard = 'attackCard';
        break;
      }
      case Card.skip: {
        effectCard = 'skipCard';
        break;
      }
      default: {
        effectCard = '';
      }
    }
    const result = await this.customGameRoomService.useEffectCard(roomId, card);
    const newEffect = {
      ...data,
      [effectCard]: result,
    };
    this.server.to(roomId).emit('new-effect', newEffect);
  }

  @SubscribeMessage('use-nope')
  async onUseNope(socket: Socket, data: any) {
    const { roomId } = data;
    this.server.to(roomId).emit('new-nope', data);
  }

  @SubscribeMessage('no-one-nope')
  async onNoOneNope(socket: Socket, data: any) {
    const { roomId } = data;
    this.server.to(roomId).emit('no-new-nope', data);
  }

  @SubscribeMessage('player-exit')
  async onPlayerExit(socket: Socket, data: any) {
    const { roomId, userId } = data;
    const exitResult = await this.customGameRoomService.loseGame(
      roomId,
      userId,
      true,
    );
    this.server.to(roomId).emit('new-exit', { ...data, ...exitResult });

    const result = await this.customGameRoomService.resultGame(roomId);
    if (result) {
      this.server.to(roomId).emit('new-win', { result });
    }
  }

  @SubscribeMessage('game-rank-win')
  async onRankWin(socket: Socket, data: any) {
    const { roomId, userId } = data;
    // this.server.to(roomId).emit('no-new-nope', data);
    console.log('game-rank-win', data);
    this.server.to(roomId).emit('debug', 'got it');
    await this.customGameRoomService.onRankWin(userId, roomId);
  }

  // chat service
  @SubscribeMessage('message-send-room')
  async onSendMessageRoom(socket: Socket, data: any) {
    console.log(data);
    console.log('message-send-room');
    const { fromRoomId } = data;
    console.log('message send room');
    this.server.to(fromRoomId).emit('message-get-room', data);
  }

  @SubscribeMessage('message-send-private')
  async onSendMessagePrivate(socket: Socket, data: any) {
    this.server.emit('message-get-private', data);
  }
}
