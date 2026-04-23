import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import configuration, { validateEnv } from './config/configuration';
import { AuthModule } from './modules/auth/auth.module';
import { CompanyModule } from './modules/company/company.module';
import { IamModule } from './modules/iam/iam.module';
import { OrgModule } from './modules/org/org.module';
import { HrmModule } from './modules/hrm/hrm.module';
import { CrmModule } from './modules/crm/crm.module';
import { AuditModule } from './modules/audit/audit.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [configuration],
      validate: validateEnv,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('app.mongodbUri'),
        dbName: configService.get<string>('app.mongodbDbName'),
      }),
    }),
    AuditModule,
    AuthModule,
    CompanyModule,
    IamModule,
    OrgModule,
    HrmModule,
    CrmModule,
  ],
})
export class AppModule {}
