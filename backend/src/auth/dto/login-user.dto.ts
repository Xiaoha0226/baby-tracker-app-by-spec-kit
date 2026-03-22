import { IsString, MinLength } from 'class-validator';

export class LoginUserDto {
  @IsString({ message: '账号不能为空' })
  account: string;

  @IsString({ message: '密码不能为空' })
  @MinLength(8, { message: '密码长度至少为8位' })
  password: string;
}
