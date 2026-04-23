import { IsMongoId, IsOptional, IsString } from 'class-validator';

export class UpdateOrgUnitDto {
  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsMongoId()
  parentId?: string;

  @IsOptional()
  @IsMongoId()
  branchId?: string;

  @IsOptional()
  @IsMongoId()
  managerEmployeeId?: string;

  @IsOptional()
  @IsString()
  status?: string;
}
