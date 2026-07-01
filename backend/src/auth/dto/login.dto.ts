import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { normalizeText } from '../../common/text';

export class LoginDto {
  @IsEmail()
  @MaxLength(180)
  @Transform(({ value }) => normalizeText(String(value ?? '').toLowerCase(), 180))
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(120)
  password: string;
}

