import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class InternalSecretGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const secret = request.headers['x-internal-secret'];
    const internalSecret = this.configService.get('INTERNAL_SECRET');

    if (!secret || secret !== internalSecret) {
      throw new ForbiddenException('Invalid internal secret');
    }

    return true;
  }
}
