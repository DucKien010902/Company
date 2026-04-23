import { ArrayNotEmpty, IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  key!: string;

  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  permissions!: string[];

  @IsOptional()
  @IsBoolean()
  isSystem?: boolean;
}
