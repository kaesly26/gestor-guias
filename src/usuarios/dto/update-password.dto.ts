import { IsString, IsNotEmpty } from 'class-validator';

export class UpdatePasswordDto {
  @IsString()
  @IsNotEmpty()
  newPassword: string;
}
