import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber, IsString, Length } from 'class-validator';

export class VrifyOtpDto {
  @ApiProperty({ example: '00000' })
  @IsString()
  @Length(5, 5, { message: 'otp must be 5 characters' })
  otp: string;

  @ApiProperty({ example: '09924164032' })
  @IsString()
  @IsPhoneNumber('IR', { message: 'phone must be a valid phone number' })
  phone: string;
}
