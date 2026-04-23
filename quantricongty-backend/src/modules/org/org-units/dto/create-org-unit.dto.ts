import { IsMongoId, IsOptional, IsString } from 'class-validator';

export class CreateOrgUnitDto {
  @IsString()
  code!: string;

  @IsString()
  name!: string;

  @IsString()
  status!: string;

  @IsOptional()
  @IsMongoId()
  parentId?: string;

  @IsOptional()
  @IsMongoId()
  branchId?: string;

  @IsOptional()
  @IsMongoId()
  managerEmployeeId?: string;
}
