import { IsEmail, IsString, MinLength, IsOptional, ValidateIf } from 'class-validator';

export class RegisterUserDto {
  @IsOptional()
  @IsEmail({}, { message: '请输入有效的邮箱地址' })
  email?: string;

  @IsOptional()
  @IsString({ message: '手机号格式不正确' })
  phone?: string;

  @ValidateIf((o) => !o.email && !o.phone)
  @IsString({ message: '邮箱或手机号至少填写一项' })
  _validateAccount?: string;

  @IsString({ message: '密码不能为空' })
  @MinLength(8, { message: '密码长度至少为8位' })
  password: string;
}
