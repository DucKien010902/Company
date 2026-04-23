import { IsBoolean, IsEmail, IsMongoId, IsOptional, IsString } from 'class-validator';

export class UpdateContactDto {
  @IsOptional()
  @IsMongoId()
  partyId?: string;

  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  department?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;

  @IsOptional()
  @IsString()
  notes?: string;
}
