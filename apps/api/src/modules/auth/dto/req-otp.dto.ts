import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber, IsString } from 'class-validator';

export class RequestOtpDto {
  @ApiProperty({ example: '09924164032' })
  @IsString()
  @IsPhoneNumber('IR', { message: 'phone must be a valid phone number' })
  phone: string;
}
