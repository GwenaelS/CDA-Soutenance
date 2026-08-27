"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Guild = void 0;
const typeorm_1 = require("typeorm");
const guild_config_entity_1 = require("./guild-config.entity");
const level_config_entity_1 = require("./level-config.entity");
const level_reward_entity_1 = require("./level-reward.entity");
const member_entity_1 = require("./member.entity");
const log_channel_entity_1 = require("./log-channel.entity");
const filtered_word_entity_1 = require("./filtered-word.entity");
const exempted_role_entity_1 = require("./exempted-role.entity");
const automatic_role_entity_1 = require("./automatic-role.entity");
const moc_channel_entity_1 = require("./moc-channel.entity");
const embed_entity_1 = require("./embed.entity");
const twitch_entity_1 = require("./twitch.entity");
const log_entity_1 = require("./log.entity");
let Guild = class Guild {
    guild_id;
    guild_name;
    guild_config;
    level_config;
    level_rewards;
    members;
    logs;
    channelLogs;
    filtered_words;
    exempted_roles;
    automatic_roles;
    moc_channels;
    embeds;
    twitch_channels;
};
exports.Guild = Guild;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ type: "bigint", unsigned: true, nullable: false }),
    __metadata("design:type", String)
], Guild.prototype, "guild_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 100 }),
    __metadata("design:type", String)
], Guild.prototype, "guild_name", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => guild_config_entity_1.Guild_config, (guildConfig) => guildConfig.guild),
    __metadata("design:type", guild_config_entity_1.Guild_config)
], Guild.prototype, "guild_config", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => level_config_entity_1.Level_config, (levelConfig) => levelConfig.guild),
    __metadata("design:type", level_config_entity_1.Level_config)
], Guild.prototype, "level_config", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => level_reward_entity_1.Level_reward, (levelReward) => levelReward.guild),
    __metadata("design:type", Array)
], Guild.prototype, "level_rewards", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => member_entity_1.Member, (member) => member.guild),
    __metadata("design:type", Array)
], Guild.prototype, "members", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => log_entity_1.Log, (log) => log.guild),
    __metadata("design:type", Array)
], Guild.prototype, "logs", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => log_channel_entity_1.Channel_log, (channelLog) => channelLog.guild),
    __metadata("design:type", Array)
], Guild.prototype, "channelLogs", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => filtered_word_entity_1.Filtered_word, (filteredWord) => filteredWord.guild),
    __metadata("design:type", Array)
], Guild.prototype, "filtered_words", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => exempted_role_entity_1.Exempted_role, (exemptedRole) => exemptedRole.guild),
    __metadata("design:type", Array)
], Guild.prototype, "exempted_roles", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => automatic_role_entity_1.Automatic_role, (automaticRole) => automaticRole.guild),
    __metadata("design:type", Array)
], Guild.prototype, "automatic_roles", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => moc_channel_entity_1.Moc_channel, (mocChannel) => mocChannel.guild),
    __metadata("design:type", Array)
], Guild.prototype, "moc_channels", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => embed_entity_1.Embed, (embed) => embed.guild),
    __metadata("design:type", Array)
], Guild.prototype, "embeds", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => twitch_entity_1.Twitch, (twitch) => twitch.guild),
    __metadata("design:type", Array)
], Guild.prototype, "twitch_channels", void 0);
exports.Guild = Guild = __decorate([
    (0, typeorm_1.Entity)("guild")
], Guild);
//# sourceMappingURL=guild.entity.js.map