import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class BootstrapCompanyPayloadDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  legalName?: string;

  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  taxCode?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  website?: string;

  @IsOptional()
  @IsString()
  address?: string;
}

class BootstrapOwnerPayloadDto {
  @IsString()
  fullName!: string;

  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsString()
  @MinLength(6)
  password!: string;
}

export class BootstrapOwnerDto {
  @ValidateNested()
  @Type(() => BootstrapCompanyPayloadDto)
  company!: BootstrapCompanyPayloadDto;

  @ValidateNested()
  @Type(() => BootstrapOwnerPayloadDto)
  owner!: BootstrapOwnerPayloadDto;
}
