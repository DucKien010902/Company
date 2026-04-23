import { ArrayUnique, IsArray, IsMongoId, IsOptional, IsString } from 'class-validator';

export class CreatePositionDto {
  @IsString()
  code!: string;

  @IsString()
  name!: string;

  @IsString()
  status!: string;

  @IsOptional()
  @IsString()
  level?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  @IsMongoId()
  defaultRoleId?: string;

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsMongoId({ each: true })
  defaultRoleIds?: string[];
}
