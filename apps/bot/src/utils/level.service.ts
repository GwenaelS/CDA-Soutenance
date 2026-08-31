import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Level_config, Level_reward } from '@wystrelia/shared';
import { GuildMember } from 'discord.js';
import { Repository } from 'typeorm';

export interface LevelSettings {
  maxLevel: number;
  xpMultiplier: number;
  xpPerMessage: number;
  xpPerVoiceMinute: number;
  xpCooldownSec: number;
}

// Valeurs par défaut utilisées tant qu'aucun `Level_config` n'a été créé pour
// le serveur (le dashboard permettra de les personnaliser, RG-18).
const DEFAULT_LEVEL_SETTINGS: LevelSettings = {
  maxLevel: 100,
  xpMultiplier: 1,
  xpPerMessage: 15,
  xpPerVoiceMinute: 10,
  xpCooldownSec: 60,
};

@Injectable()
export class LevelService {
  private readonly logger = new Logger(LevelService.name);

  constructor(
    @InjectRepository(Level_config)
    private readonly levelConfigRepository: Repository<Level_config>,
    @InjectRepository(Level_reward)
    private readonly levelRewardRepository: Repository<Level_reward>,
  ) {}

  async getSettings(guildId: string): Promise<LevelSettings> {
    const config = await this.levelConfigRepository.findOne({
      where: { guild: { guild_id: guildId } },
    });
    if (!config) return DEFAULT_LEVEL_SETTINGS;

    return {
      maxLevel: config.max_level,
      xpMultiplier: config.xp_multiplier,
      xpPerMessage: config.xp_per_message,
      xpPerVoiceMinute: config.xp_per_voice_min,
      xpCooldownSec: config.xp_cooldown_sec,
    };
  }

  /**
   * XP cumulé nécessaire pour atteindre `level`. Courbe quadratique simple ;
   * aucune formule officielle n'étant spécifiée dans les specs, celle-ci est
   * centralisée ici pour rester facile à remplacer.
   */
  xpForLevel(level: number): number {
    return 100 * level * level;
  }

  levelForXp(xp: number, maxLevel: number): number {
    const level = Math.floor(Math.sqrt(xp / 100));
    return Math.min(level, maxLevel);
  }

  /**
   * RG-19 : le passage d'un palier attribue le rôle associé et retire celui
   * du palier précédent (rôles remplacés, non cumulés).
   */
  async applyLevelRewards(
    member: GuildMember,
    guildId: string,
    oldLevel: number,
    newLevel: number,
  ): Promise<void> {
    if (newLevel === oldLevel) return;

    const rewards = await this.levelRewardRepository.find({
      where: { guild: { guild_id: guildId } },
    });
    if (rewards.length === 0) return;

    const previousReward = rewards
      .filter((reward) => reward.level <= oldLevel)
      .sort((a, b) => b.level - a.level)[0];
    const newReward = rewards
      .filter((reward) => reward.level <= newLevel)
      .sort((a, b) => b.level - a.level)[0];

    if (previousReward?.role_id === newReward?.role_id) return;

    try {
      if (previousReward && member.roles.cache.has(previousReward.role_id)) {
        await member.roles.remove(previousReward.role_id);
      }
      if (newReward) {
        await member.roles.add(newReward.role_id);
      }
    } catch (err) {
      this.logger.warn(
        `Impossible de mettre à jour le rôle de palier pour ${member.id} sur ${guildId}`,
        err,
      );
    }
  }
}
