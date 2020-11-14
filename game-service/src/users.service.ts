import { get } from 'lodash';
import { Injectable } from '@nestjs/common';
import {
  ClientOptions,
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

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

  async getUserName(userId: string) {
    return get(this.client.send('getUserByUserId', userId), 'userName');
  }
}
