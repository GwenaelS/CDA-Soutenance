import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import type { Request } from 'express';

@Injectable()
export class GuildGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context
      .switchToHttp()
      .getRequest<Request<{ guildId: string }>>();
    const guildId = request.params.guildId;

    if (!request.user.guilds.includes(guildId)) {
      throw new ForbiddenException();
    }

    return true;
  }
}
