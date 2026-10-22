import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber, IsString, Matches } from 'class-validator';

export class VerifyOtpDto {
  @ApiProperty({ example: '09911110001' })
  @IsString()
  @IsPhoneNumber('IR', { message: 'phone must be a valid phone number' })
  phone!: string;

  @ApiProperty({ example: '00000', minLength: 5, maxLength: 5 })
  @Matches(/^\d{5}$/, { message: 'code must be 5 digits' })
  code!: string;
}
