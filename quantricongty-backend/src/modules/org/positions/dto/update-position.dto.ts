import { ArrayUnique, IsArray, IsMongoId, IsOptional, IsString } from 'class-validator';

export class UpdatePositionDto {
  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  level?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsMongoId({ each: true })
  defaultRoleIds?: string[];

  @IsOptional()
  @IsString()
  status?: string;
}
