import {
  IsArray,
  IsDateString,
  IsEmail,
  IsMongoId,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class EmergencyContactDto {
  @IsString()
  name!: string;

  @IsString()
  phone!: string;

  @IsOptional()
  @IsString()
  relation?: string;
}

export class UpdateEmployeeDto {
  @IsOptional()
  @IsString()
  employeeCode?: string;

  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsOptional()
  @IsString()
  nationalId?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsMongoId()
  accountId?: string;

  @IsOptional()
  @IsMongoId()
  branchId?: string;

  @IsOptional()
  @IsMongoId()
  orgUnitId?: string;

  @IsOptional()
  @IsMongoId()
  positionId?: string;

  @IsOptional()
  @IsMongoId()
  managerEmployeeId?: string;

  @IsOptional()
  @IsString()
  employmentType?: string;

  @IsOptional()
  @IsString()
  workStatus?: string;

  @IsOptional()
  @IsDateString()
  hireDate?: string;

  @IsOptional()
  @IsDateString()
  leaveDate?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => EmergencyContactDto)
  emergencyContacts?: EmergencyContactDto[];

  @IsOptional()
  @IsObject()
  customFields?: Record<string, unknown>;

  @IsOptional()
  @IsString()
  notes?: string;
}
