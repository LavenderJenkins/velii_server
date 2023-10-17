import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { TimeToLive } from 'src/enums';
import { ExceptionResponse } from 'src/exceptions/common.exception';
import { User } from 'src/models/user.model';
import { RegisterDto } from './dto/register.dto';
import { InjectModel } from '@nestjs/mongoose';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    // private readonly model: MongoModel,
    private readonly jwtService: JwtService,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  generateAccessToken(userId: string, full_name: string, phone: string): string {
    return this.jwtService.sign(
      {
        userId,
        full_name,
        phone
      },
      {
        secret: process.env.ACCESS_TOKEN_SECRET,
        expiresIn: TimeToLive.OneDay,
      },
    );
  }

  async getUser(phone: string): Promise<User> | null {
    return this.userModel.findOne({ phone: phone }).lean();
  }

  async register(data: RegisterDto): Promise<any> {
    const { full_name: fullName, phone, password } = data;

    const userExist = await this.getUser(phone);

    if (userExist) {
      throw new ExceptionResponse(
        HttpStatus.CONFLICT,
        'Số điện thoại đã được đăng ký',
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = (
      await this.userModel.create({
        full_name: fullName,
        phone: phone,
        password: hashedPassword,
      })
    ).toObject();

    console.log(newUser);

    delete newUser.password;
    return newUser;
  }

  async login(body: LoginDto) {
    const { phone, password } = body;

    const user = await this.getUser(phone);

    if (!user) {
      throw new ExceptionResponse(
        HttpStatus.BAD_REQUEST,
        'Số điện thoại chưa được đăng ký',
        );
      }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw new ExceptionResponse(
        HttpStatus.BAD_REQUEST,
        'Số điện thoại / mật khẩu không chính xác',
      );
    }

    delete user.password;

    const accessToken = this.generateAccessToken(user._id, user.full_name, user.phone);
    return {
      ...user,
      accessToken,
    };
  }
}
