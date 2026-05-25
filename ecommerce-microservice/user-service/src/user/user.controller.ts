import { Controller, Get, Headers } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  findMe(@Headers('x-user-id') userId: string) {
    return this.userService.findMe(userId);
  }
}
