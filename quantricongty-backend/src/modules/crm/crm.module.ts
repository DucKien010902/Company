import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuditModule } from '../audit/audit.module';
import { CommonModule } from '../../common/common.module';
import { ExternalParty, ExternalPartySchema } from './schemas/external-party.schema';
import { ContactPerson, ContactPersonSchema } from './schemas/contact-person.schema';
import { PartiesService } from './parties.service';
import { ContactsService } from './contacts.service';
import { PartiesController } from './parties.controller';
import { ContactsController } from './contacts.controller';

@Module({
  imports: [
    CommonModule,
    AuditModule,
    MongooseModule.forFeature([
      { name: ExternalParty.name, schema: ExternalPartySchema },
      { name: ContactPerson.name, schema: ContactPersonSchema },
    ]),
  ],
  controllers: [PartiesController, ContactsController],
  providers: [PartiesService, ContactsService],
  exports: [MongooseModule],
})
export class CrmModule {}
