import { IsBoolean, IsEmail, IsMongoId, IsOptional, IsString } from 'class-validator';

export class CreateContactDto {
  @IsMongoId()
  partyId!: string;

  @IsString()
  fullName!: string;

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
