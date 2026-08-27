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
exports.Member = void 0;
const typeorm_1 = require("typeorm");
const guild_entity_1 = require("./guild.entity");
const warning_entity_1 = require("./warning.entity");
const birthday_entity_1 = require("./birthday.entity");
let Member = class Member {
    id;
    discord_user_id;
    current_xp;
    current_level;
    last_xp_at;
    joined_at;
    left_at;
    guild;
    warnings;
    birthday;
};
exports.Member = Member;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Member.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "bigint", unsigned: true }),
    __metadata("design:type", String)
], Member.prototype, "discord_user_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", default: 0 }),
    __metadata("design:type", Number)
], Member.prototype, "current_xp", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", default: 0 }),
    __metadata("design:type", Number)
], Member.prototype, "current_level", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "datetime", nullable: true }),
    __metadata("design:type", Object)
], Member.prototype, "last_xp_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "datetime" }),
    __metadata("design:type", Date)
], Member.prototype, "joined_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "datetime", nullable: true }),
    __metadata("design:type", Object)
], Member.prototype, "left_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => guild_entity_1.Guild, (guild) => guild.members, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: "guild_id" }),
    __metadata("design:type", guild_entity_1.Guild)
], Member.prototype, "guild", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => warning_entity_1.Warning, (warning) => warning.member),
    __metadata("design:type", Array)
], Member.prototype, "warnings", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => birthday_entity_1.Birthday, (birthday) => birthday.member),
    __metadata("design:type", Object)
], Member.prototype, "birthday", void 0);
exports.Member = Member = __decorate([
    (0, typeorm_1.Entity)("member"),
    (0, typeorm_1.Unique)("member_guild_discord", ["guild", "discord_user_id"])
], Member);
//# sourceMappingURL=member.entity.js.map