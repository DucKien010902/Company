import {
  IsArray,
  IsMongoId,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdatePartyDto {
  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  partyType?: 'person' | 'company';

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  relationshipTypes?: string[];

  @IsOptional()
  @IsString()
  displayName?: string;

  @IsOptional()
  @IsString()
  legalName?: string;

  @IsOptional()
  @IsString()
  taxCode?: string;

  @IsOptional()
  @IsString()
  website?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  phones?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  emails?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  addresses?: string[];

  @IsOptional()
  @IsMongoId()
  ownerEmployeeId?: string;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  assignedEmployeeIds?: string[];

  @IsOptional()
  @IsString()
  source?: string;

  @IsOptional()
  @IsString()
  lifecycleStatus?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsObject()
  customFields?: Record<string, unknown>;

  @IsOptional()
  @IsString()
  notes?: string;
}
