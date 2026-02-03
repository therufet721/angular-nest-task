import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<{ message: string }> {
    const { login, password } = registerDto;

    // Check if user already exists
    const existingUser = await this.usersService.findByLogin(login);
    if (existingUser) {
      throw new ConflictException('User with this login already exists');
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    await this.usersService.create(login, hashedPassword);

    return { message: 'User registered successfully' };
  }

  async login(loginDto: LoginDto): Promise<{ access_token: string }> {
    const { login, password } = loginDto;

    // Find user
    const user = await this.usersService.findByLogin(login);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT
    const payload = { sub: user._id.toString(), login: user.login };
    const access_token = this.jwtService.sign(payload);

    return { access_token };
  }

  async validate(userId: string): Promise<{ id: string; login: string }> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      id: user._id.toString(),
      login: user.login,
    };
  }
}
