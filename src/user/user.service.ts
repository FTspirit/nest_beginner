import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { User } from './entities/user.entity';
import { DbService } from 'src/db/db.service';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UserService {
  @Inject(DbService)
  private readonly dbService: DbService;

  async uploadAvatar(file: Express.Multer.File) {}

  async login(loginUserDto: LoginUserDto) {
    const users: User[] = await this.dbService.read();
    console.log(users, 'Users ');

    const userFound = users.find(
      (user) =>
        user.accountName === loginUserDto.accountName &&
        user.password === loginUserDto.password,
    );

    if (!userFound) {
      throw new BadRequestException(`Invalid account name or password`);
    }

    if (userFound.password === loginUserDto.password) {
      return 'User logged in successfully';
    }

    return 'User logged in successfully';
  }

  async register(registerUserDto: RegisterUserDto) {
    const users: User[] = await this.dbService.read();
    console.log(users, 'Users ');

    const userFound = users.find(
      (user) => user.accountName === registerUserDto.accountName,
    );

    if (userFound) {
      throw new BadRequestException(
        `Account name ${userFound.accountName} already exists`,
      );
    }

    const user = new User();
    user.accountName = registerUserDto.accountName;
    user.password = registerUserDto.password;

    users.push(user);

    await this.dbService.write(user);
    return 'User registered successfully';
  }
}
