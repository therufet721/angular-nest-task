import { IsString, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';
import { sanitizeInput } from '../../common/utils/sanitize';

export class LoginDto {
  @Transform(({ value }) => sanitizeInput(value))  // Sanitize: trim + escape HTML
  @IsString()
  @IsNotEmpty()
  login: string;

  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)  // Trim only
  @IsString()
  @IsNotEmpty()
  password: string;
}
