import { IsString, MinLength, IsNotEmpty, MaxLength, Matches } from 'class-validator';
import { Transform } from 'class-transformer';
import { sanitizeInput } from '../../common/utils/sanitize';

export class RegisterDto {
  @Transform(({ value }) => sanitizeInput(value))  // Sanitize: trim + escape HTML
  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'Login must be at least 3 characters long' })
  @MaxLength(30, { message: 'Login must not exceed 30 characters' })
  @Matches(/^[a-zA-Z0-9_]+$/, { message: 'Login can only contain letters, numbers, and underscores' })
  login: string;

  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)  // Trim only (will be hashed)
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(50, { message: 'Password must not exceed 50 characters' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  })
  password: string;
}
