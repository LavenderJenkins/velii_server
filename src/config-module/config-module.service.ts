import { Injectable } from '@nestjs/common';
import { JwtModuleOptions } from '@nestjs/jwt';
import { MongooseModuleFactoryOptions, MongooseModuleOptions } from '@nestjs/mongoose';
import { MongooseOptions } from 'mongoose';

@Injectable()
export class ConfigServiceProvider {

  async createRedisOptions(): Promise<any> {};

  createJwtOptions(): JwtModuleOptions {
    return {secretOrPrivateKey: process.env.ACCESS_TOKEN_SECRET};
  }

  createMongoOptions(): MongooseModuleOptions {
    return {
      uri: `mongodb://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/${process.env.MONGODB_DATABASE}?authSource=admin`,
      auth:{
        username: process.env.MONGODB_USERNAME,
        password: process.env.MONGODB_PASSWORD
      }
    }
  }
}
