import { Injectable } from '@nestjs/common';
import { NewUserJoinCustomRoomDto, Card, CreateGameRoomDto, GameMode } from './game.dto';

@Injectable()
export class GameService {
  rooms = {};

  setRoomByRoomId(roomId: string, features: any) {
    this.rooms[roomId] = { ...this.rooms[roomId], ...features };
  }

  async createGameRoom(createGameRoomDto: CreateGameRoomDto) {
    const { usersId, mode, options } = createGameRoomDto;
    let roomId = (Math.random() * 999999).toString().substr(-6);
    while (this.rooms[roomId]) {
      roomId = (Math.random() * 999999).toString().substr(-6);
    }
    this.rooms[roomId] = {};
    this.rooms[roomId]['usersId'] = usersId;
    this.rooms[roomId]['mode'] = mode;
    this.rooms[roomId]['options'] = options;
    return roomId;
  }

  async createCustomRoom(userId: string) {
    const roomId = '100001';
    this.rooms[roomId] = {};
    const usersId: string[] = [userId];
    this.rooms[roomId]['usersId'] = usersId;

    console.log('[AllCustomRooms] :\t', this.rooms);
    return roomId;
  }

  async joinCustomRoom(newUserJoinRoom: NewUserJoinCustomRoomDto) {
    const { userId, roomId } = newUserJoinRoom;
    const { usersId } = this.rooms[roomId];
    if (this.rooms[roomId]['nextTurnLeft']) return false;
    usersId.push(userId);

    // Todo: add userName on request
    const usersName: string[] = [];

    const allUsersInRoom = {
      usersId: usersId,
      usersName,
      roomId,
    };

    this.setRoomByRoomId(roomId, { usersId });

    console.log('[AllCustomRooms] :\t', this.rooms);
    return allUsersInRoom;
  }

  async shuffle(array: string[]) {
    let currentIndex = array.length,
      temporaryValue,
      randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  async onStartGame(roomId: string) {
    // determine first turn and turn left
    console.log('rooms: ', this.rooms);
    const { usersId } = this.rooms[roomId];
    this.rooms[roomId]['nextUserIndex'] = 0;
    this.rooms[roomId]['lastUserIndex'] = 0;
    this.rooms[roomId]['nextTurnLeft'] = 1;
    this.rooms[roomId]['aliveUsersId'] = usersId;
    this.rooms[roomId]['result'] = [];

    return this.initializeDeck(roomId);
  }

  async initializeDeck(roomId: string) {
    const { usersId, mode, options } = this.rooms[roomId];
    const userNumber = usersId.length;

    console.log('options: ', options);

    let allCards = {};
    let defuseNumber = 0;
    let time = 30; // default

    if (mode === GameMode.rank) {
      allCards = {
        nope: 5,
        attack: 4,
        skip: 4,
        favor: 4,
        shuffle: 4,
        seeTheFuture: 5,
        common1: 4,
        common2: 4,
        common3: 4,
        common4: 4,
        common5: 4,
      };
      defuseNumber = 1;
    } else if (mode === GameMode.custom) {
      const {
        defuse,
        nope,
        attack,
        skip,
        favor,
        shuffle,
        seeTheFuture,
        common1,
        common2,
        common3,
        common4,
        common5,
        timePerTurn,
      } = options;
      allCards = {
        nope,
        attack,
        skip,
        favor,
        shuffle,
        seeTheFuture,
        common1,
        common2,
        common3,
        common4,
        common5,
      };
      defuseNumber = defuse;
      time = timePerTurn;
    }

    let deck = [];
    for (const cardType in allCards) {
      deck.push(...Array(allCards[cardType]).fill(Card[cardType]));
    }

    deck = await this.shuffle(deck);
    console.log('after deck: ', deck);

    const usersCard = {};
    for (let j = 0; j < userNumber; j++) {
      usersCard[j] = [];
      for (let i = 0; i < 7; i++) {
        usersCard[j].push(deck[userNumber * i + j]);
      }
      usersCard[j].push(Card.defuse);
    }

    deck = deck.slice(userNumber * 7);

    // add defuse and exploding puppy
    deck.push(...Array(defuseNumber).fill(Card.defuse));
    deck.push(...Array(userNumber - 1).fill(Card.explodingPuppy));
    deck = await this.shuffle(deck);
    this.setRoomByRoomId(roomId, { deck });

    const newGame = {
      roomId,
      leftCardNumber: deck.length,
      usersId: usersId,
      usersCard: usersCard,
      nextUserId: usersId[0],
      nextTurnLeft: 1,
      timePerTurn: time,
      mode,
    };

    console.log('newGame: ', newGame);

    return newGame;
  }

  async drawCard(userId: string, roomId: string) {
    const { deck, aliveUsersId, nextUserIndex, nextTurnLeft } = this.rooms[
      roomId
    ];
    if (deck.length <= 0) {
      return false;
    }

    const card = deck.shift();
    const leftCardNumber = deck.length;
    console.log('userId: ', userId);
    console.log('nextUserIndex: ', nextUserIndex);
    console.log('aliveUsersId: ', aliveUsersId);
    console.log('nextTurnLeft: ', nextTurnLeft);
    let nextTurnLeftTmp = nextTurnLeft - 1;

    const nextUserIndexTmp =
      nextTurnLeftTmp === 0
        ? (nextUserIndex + 1) % aliveUsersId.length
        : nextUserIndex;
    console.log('nextUserTmp: ', aliveUsersId[nextUserIndexTmp]);
    nextTurnLeftTmp = nextTurnLeftTmp === 0 ? 1 : nextTurnLeftTmp;
    this.setRoomByRoomId(roomId, {
      nextUserIndex: nextUserIndexTmp,
      nextTurnLeft: nextTurnLeftTmp,
      lastUserIndex: nextUserIndex,
      deck,
    });

    const newCard = {
      userId,
      roomId,
      card,
      leftCardNumber,
      nextUserId: aliveUsersId[nextUserIndexTmp],
      nextTurnLeft: nextTurnLeftTmp,
    };
    return newCard;
  }

  async useCard(userId: string, roomId: string, card: string, cardIdx: number) {
    const { aliveUsersId, nextUserIndex, nextTurnLeft } = this.rooms[roomId];
    const newCardUse = {
      userId,
      roomId,
      card,
      cardIdx,
      nextUserId: aliveUsersId[nextUserIndex],
      nextTurnLeft: nextTurnLeft,
    };
    return newCardUse;
  }

  async seeTheFuture(roomId: string) {
    const { deck } = this.rooms[roomId];
    return deck.slice(0, 3);
  }

  async insertExplodingPuppy(roomId: string, idx: number) {
    const { deck, aliveUsersId, nextUserIndex } = this.rooms[roomId];
    const deckTmp = [
      ...deck.slice(0, idx),
      Card.explodingPuppy,
      ...deck.slice(idx),
    ];
    this.setRoomByRoomId(roomId, { deck: deckTmp });

    return aliveUsersId[nextUserIndex];
  }

  async useEffectCard(roomId: string, card: string) {
    let newEffectCard;
    switch (card) {
      case Card.seeTheFuture: {
        newEffectCard = await this.seeTheFuture(roomId);
        break;
      }
      case Card.shuffle: {
        const { deck } = this.rooms[roomId];
        const deckTmp = await this.shuffle(deck);
        this.setRoomByRoomId(roomId, { deck: deckTmp });
        newEffectCard = true;
        break;
      }
      case Card.favor: {
        newEffectCard = true;
        break;
      }
      case Card.attack: {
        const { nextTurnLeft, nextUserIndex, aliveUsersId } = this.rooms[
          roomId
        ];
        const nextTurnLeftTmp = nextTurnLeft === 1 ? 2 : nextTurnLeft + 2;
        const nextUserIndexTmp = (nextUserIndex + 1) % aliveUsersId.length;
        this.setRoomByRoomId(roomId, {
          nextTurnLeft: nextTurnLeftTmp,
          lastUserIndex: nextUserIndex,
          nextUserIndex: nextUserIndexTmp,
        });
        newEffectCard = {
          nextTurnLeft: nextTurnLeftTmp,
          nextUserId: aliveUsersId[nextUserIndexTmp],
        };
        break;
      }
      case Card.skip: {
        const { nextTurnLeft, nextUserIndex, aliveUsersId } = this.rooms[
          roomId
        ];
        let nextTurnLeftTmp = nextTurnLeft - 1;
        let nextUserIndexTmp = nextUserIndex;
        if (nextTurnLeftTmp === 0) {
          this.setRoomByRoomId(roomId, { lastUserIndex: nextUserIndex });
          nextUserIndexTmp = (nextUserIndex + 1) % aliveUsersId.length;
          nextTurnLeftTmp = 1;
        }
        this.setRoomByRoomId(roomId, {
          nextTurnLeft: nextTurnLeftTmp,
          nextUserIndex: nextUserIndexTmp,
        });
        newEffectCard = {
          nextTurnLeft: nextTurnLeftTmp,
          nextUserId: aliveUsersId[nextUserIndexTmp],
        };
        console.log('skip');
        break;
      }
      default: {
        console.log('card: ', card);
      }
    }
    return newEffectCard;
  }

  async loseGame(roomId: string, userId: string, isExit: boolean) {
    const {
      nextUserIndex,
      aliveUsersId,
      result,
      deck,
      nextTurnLeft,
      lastUserIndex,
    } = this.rooms[roomId];

    const index = aliveUsersId.indexOf(userId);
    if (index === -1) return false;
    const deadUser = aliveUsersId[lastUserIndex];
    console.log('aliveUsersId', aliveUsersId);

    result.push(aliveUsersId[index]);
    if (index > -1) {
      aliveUsersId.splice(index, 1);
    }

    if (aliveUsersId.length === 1) {
      result.push(aliveUsersId[0]);
      aliveUsersId.splice(0, 1);
    }

    const nextUserIndexTmp =
      nextUserIndex > index
        ? (nextUserIndex - 1 + aliveUsersId.length) % aliveUsersId.length
        : nextUserIndex % aliveUsersId.length;
    console.log('index: ', index);
    console.log('lastUserIndex: ', lastUserIndex);
    console.log('dead user: ', deadUser);
    console.log('now user: ', userId);
    if (isExit) {
      const deckIndex = deck.indexOf(Card.explodingPuppy);
      if (deckIndex > -1) {
        deck.splice(deckIndex, 1);
      }
      this.setRoomByRoomId(roomId, {
        deck,
      });
    }
    this.setRoomByRoomId(roomId, {
      nextUserIndex: nextUserIndexTmp,
      lastUserIndex: nextUserIndexTmp,
    });
    console.log('aaa', nextUserIndex, nextUserIndexTmp, index);
    const gameLose = {
      nextUserId: aliveUsersId[nextUserIndexTmp],
      nextTurnLeft,
    };
    console.log('nextUserIndexTmp: ', nextUserIndexTmp);
    console.log('aliveUsersId: ', aliveUsersId);
    console.log('nextUsersId: ', aliveUsersId[nextUserIndexTmp]);
    console.log('gameLose: ', gameLose);
    return gameLose;
  }

  async resultGame(roomId: string) {
    const { result, aliveUsersId } = this.rooms[roomId];
    if (aliveUsersId.length !== 0) {
      return false;
    }

    return result;
  }

  async isAlreadyJoin(userId: string, roomId: string) {
    const { usersId } = this.rooms[roomId];
    if (usersId.indexOf(userId) === -1) return false;
    return true;
  }

  async onRankWin(userId: string, roomId: string) {
    const { usersId } = this.rooms[roomId];
    console.log('user win', usersId);
    console.log('users in room', usersId);
  }
  // async onPlayerExit(roomId: string, userId: string) {
  //   const { nextUserIndex, aliveUsersId, result, deck } = this.rooms[roomId];
  //   const explodeIndex = deck.indexOf(Card.explodingPuppy);
  //   const userIndex = aliveUsersId.indexOf(userId);
  //   result.push(aliveUsersId[userIndex]);
  //   if (userIndex > -1) {
  //     aliveUsersId.splice(userIndex, 1);
  //   }

  //   if (aliveUsersId.length === 1) {
  //     result.push(aliveUsersId[0]);
  //     aliveUsersId.splice(0, 1);
  //   }

  //   if (explodeIndex > -1) {
  //     deck.splice(explodeIndex, 1);
  //   }

  //   const nextUserIndexTmp = (nextUserIndex + 1) % aliveUsersId.length;

  //   this.setRoomByRoomId(roomId, {
  //     nextUserIndex: nextUserIndexTmp,
  //     lastUserIndex: nextUserIndexTmp,
  //     aliveUsersId,
  //   });

  // }
}
