import { Inject, Injectable } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { User } from './entities/user.entity';
import { DbService } from 'src/db/db.service';

@Injectable()
export class UserService {
  @Inject(DbService)
  private readonly dbService: DbService;

  async register(registerUserDto: RegisterUserDto) {
    const user = new User();
    user.accountName = registerUserDto.accountName;
    user.password = registerUserDto.password;

    await this.dbService.write(user);
    return 'User registered successfully';
  }
}
