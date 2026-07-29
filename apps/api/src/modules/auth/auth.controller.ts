import {
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';
import { JwtGuard } from './guards/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {}

  // Sends the browser to the Discord's consent screen
  @Get('discord')
  redirectToDiscord(@Res() res: Response) {
    const url = this.authService.getDiscordAuthorizeUrl();
    res.redirect(url);
  }

  // Discord redirects here after the user accepts, with ?code=xxx
  @Get('discord/callback')
  async handleDiscordCallback(
    @Query('code') code: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.authService.handleCallback(code);

    res.cookie('token', token, {
      httpOnly: true, // not readable via JS (protects against XSS stealing it)
      sameSite: 'lax', // still sent when Discord redirects the browser back here, but not on cross-site background requests (CSRF protection)
      secure: false, // true in production (cookie only sent over https)
    });

    res.redirect(this.config.get<string>('DASHBOARD_URL')!);
  }

  // Clears the auth cookie, the client is considered logged out
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('token');
  }

  // Protected route: returns whoever JwtGuard attached to req.user
  @Get('me')
  @UseGuards(JwtGuard)
  getCurrentUser(@Req() req: Request) {
    return req.user;
  }
}
