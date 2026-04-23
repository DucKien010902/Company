import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ContactPerson, ContactPersonDocument } from './schemas/contact-person.schema';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class ContactsService {
  constructor(
    @InjectModel(ContactPerson.name)
    private readonly contactModel: Model<ContactPersonDocument>,
    private readonly auditService: AuditService,
  ) {}

  async create(dto: CreateContactDto, performedByAccountId?: string) {
    const contact = await this.contactModel.create({
      ...dto,
      email: dto.email?.toLowerCase(),
      isPrimary: dto.isPrimary ?? false,
    });

    await this.auditService.log({
      action: 'create_contact',
      module: 'crm',
      entityName: 'ContactPerson',
      entityId: String(contact._id),
      performedByAccountId,
      metadata: { fullName: contact.fullName, partyId: String(contact.partyId) },
    });

    return contact;
  }

  async findAll(query: PaginationQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const search = query.search?.trim();
    const filter = search
      ? {
          $or: [
            { fullName: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { phone: { $regex: search, $options: 'i' } },
          ],
        }
      : {};

    const [items, total] = await Promise.all([
      this.contactModel
        .find(filter)
        .populate('partyId')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      this.contactModel.countDocuments(filter),
    ]);

    return { items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string) {
    const contact = await this.contactModel.findById(id).populate('partyId').lean();
    if (!contact) throw new NotFoundException('Contact not found');
    return contact;
  }

  async update(id: string, dto: UpdateContactDto, performedByAccountId?: string) {
    const contact = await this.contactModel.findByIdAndUpdate(
      id,
      dto.email ? { ...dto, email: dto.email.toLowerCase() } : dto,
      { new: true },
    );

    if (!contact) throw new NotFoundException('Contact not found');

    await this.auditService.log({
      action: 'update_contact',
      module: 'crm',
      entityName: 'ContactPerson',
      entityId: String(contact._id),
      performedByAccountId,
      metadata: { fullName: contact.fullName, partyId: String(contact.partyId) },
    });

    return contact;
  }

  async remove(id: string, performedByAccountId?: string) {
    const contact = await this.contactModel.findByIdAndDelete(id);
    if (!contact) throw new NotFoundException('Contact not found');

    await this.auditService.log({
      action: 'delete_contact',
      module: 'crm',
      entityName: 'ContactPerson',
      entityId: String(id),
      performedByAccountId,
      metadata: { fullName: contact.fullName, partyId: String(contact.partyId) },
    });

    return { success: true };
  }
}
