import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company, CompanyDocument } from './schemas/company.schema';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompanyService {
  constructor(
    @InjectModel(Company.name)
    private readonly companyModel: Model<CompanyDocument>,
  ) {}

  async getProfile() {
    const company = await this.companyModel.findOne().lean();
    if (!company) {
      throw new NotFoundException('Company profile has not been bootstrapped yet');
    }

    return company;
  }

  async updateProfile(dto: UpdateCompanyDto) {
    const company = await this.companyModel.findOneAndUpdate({}, dto, {
      new: true,
      upsert: false,
    });

    if (!company) {
      throw new NotFoundException('Company profile has not been bootstrapped yet');
    }

    return company;
  }
}
