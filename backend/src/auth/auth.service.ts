import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { hashPassword, comparePassword } from '../common/utils/password.util';

interface TokenPayload {
  sub: number;
  email: string | null;
  phone: string | null;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterUserDto) {
    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: [
        { email: dto.email || undefined },
        { phone: dto.phone || undefined },
      ],
    });

    if (existingUser) {
      throw new ConflictException('邮箱或手机号已被注册');
    }

    // Hash password
    const passwordHash = await hashPassword(dto.password);

    // Create user
    const user = this.userRepository.create({
      email: dto.email || null,
      phone: dto.phone || null,
      passwordHash,
    });

    await this.userRepository.save(user);

    // Generate tokens
    const tokens = await this.generateTokens(user);

    return {
      user: this.sanitizeUser(user),
      tokens,
    };
  }

  async login(dto: LoginUserDto) {
    // Find user by email or phone
    const user = await this.userRepository.findOne({
      where: [
        { email: dto.account },
        { phone: dto.account },
      ],
    });

    if (!user) {
      throw new UnauthorizedException('账号或密码错误');
    }

    // Verify password
    const isPasswordValid = await comparePassword(dto.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('账号或密码错误');
    }

    // Generate tokens
    const tokens = await this.generateTokens(user);

    return {
      user: this.sanitizeUser(user),
      tokens,
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const user = await this.userRepository.findOne({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('用户不存在');
      }

      const tokens = await this.generateTokens(user);

      return {
        access_token: tokens.access_token,
        expires_in: tokens.expires_in,
      };
    } catch (error) {
      throw new UnauthorizedException('刷新令牌无效或已过期');
    }
  }

  private async generateTokens(user: User) {
    const payload: TokenPayload = {
      sub: user.id,
      email: user.email,
      phone: user.phone,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN || '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
      }),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: 900, // 15 minutes in seconds
    };
  }

  private sanitizeUser(user: User) {
    return {
      id: user.id,
      email: user.email,
      phone: user.phone,
      created_at: user.createdAt,
    };
  }
}
