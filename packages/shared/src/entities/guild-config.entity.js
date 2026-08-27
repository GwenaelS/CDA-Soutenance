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
exports.Guild_config = void 0;
const typeorm_1 = require("typeorm");
const guild_entity_1 = require("./guild.entity");
let Guild_config = class Guild_config {
    id;
    welcome_channel_id;
    member_count_channel_id;
    all_log_channel_id;
    birthday_channel_id;
    twitch_channel_id;
    guild;
};
exports.Guild_config = Guild_config;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Guild_config.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "bigint", unsigned: true, nullable: true }),
    __metadata("design:type", Object)
], Guild_config.prototype, "welcome_channel_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "bigint", unsigned: true, nullable: true }),
    __metadata("design:type", Object)
], Guild_config.prototype, "member_count_channel_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "bigint", unsigned: true, nullable: true }),
    __metadata("design:type", Object)
], Guild_config.prototype, "all_log_channel_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "bigint", unsigned: true, nullable: true }),
    __metadata("design:type", Object)
], Guild_config.prototype, "birthday_channel_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "bigint", unsigned: true, nullable: true }),
    __metadata("design:type", Object)
], Guild_config.prototype, "twitch_channel_id", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => guild_entity_1.Guild, (guild) => guild.guild_config, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: "guild_id" }),
    __metadata("design:type", guild_entity_1.Guild)
], Guild_config.prototype, "guild", void 0);
exports.Guild_config = Guild_config = __decorate([
    (0, typeorm_1.Entity)("guild_config")
], Guild_config);
//# sourceMappingURL=guild-config.entity.js.map