import { Injectable } from '@nestjs/common';
import {
  ClientOptions,
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { newUserDto, UserProgressDto } from './users.dto';

@Injectable()
export class UsersService {
  private client: ClientProxy;
  private clientOptions: ClientOptions = {
    transport: Transport.TCP,
    options: {
      host: '127.0.0.1',
      port: 8877,
    },
  };

  constructor() {
    this.client = ClientProxyFactory.create(this.clientOptions);
  }

  async loginUser(loginUser) {
    return this.client.send('loginUser', loginUser);
  }

  async createNewUser(newUser: newUserDto) {
    return this.client.send('createNewUser', newUser);
  }

  async getUserByUserId(userId: string) {
    return this.client.send('getUserByUserId', userId);
  }

  async updateUserProgress(userId: string, userProgressDto: UserProgressDto) {
    return this.client.send('updateUserProgress', { userId, userProgressDto });
  }
}
