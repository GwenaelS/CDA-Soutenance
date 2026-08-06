import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Exempted_role } from '@wystrelia/shared';
import { Repository } from 'typeorm';
import { UpdateExemptedRoleDto } from './dto/update-exempted-role.dto';
import { CreateExemptedRoleDto } from './dto/create-exempted-role.dto';

@Injectable()
export class ExemptedRoleService {
  constructor(
    @InjectRepository(Exempted_role)
    private readonly exemptedRoleRepository: Repository<Exempted_role>,
  ) {}

  findAll(guildId: string): Promise<Exempted_role[]> {
    return this.exemptedRoleRepository.find({
      where: { guild: { guild_id: guildId } },
    });
  }

  async findOne(guildId: string, id: number): Promise<Exempted_role> {
    const role = await this.exemptedRoleRepository.findOneBy({
      id,
      guild: { guild_id: guildId },
    });
    if (!role) {
      throw new NotFoundException(`Exempted role ${id} not found`);
    }
    return role;
  }

  async update(
    guildId: string,
    id: number,
    dto: UpdateExemptedRoleDto,
  ): Promise<Exempted_role> {
    await this.findOne(guildId, id);
    await this.exemptedRoleRepository.update(id, dto);
    return this.findOne(guildId, id);
  }

  create(guildId: string, dto: CreateExemptedRoleDto): Promise<Exempted_role> {
    const role = this.exemptedRoleRepository.create({
      ...dto,
      guild: { guild_id: guildId },
    });
    return this.exemptedRoleRepository.save(role);
  }

  async delete(guildId: string, id: number): Promise<void> {
    const role = await this.findOne(guildId, id);
    await this.exemptedRoleRepository.remove(role);
  }
}
