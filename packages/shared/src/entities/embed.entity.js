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
exports.Embed = void 0;
const typeorm_1 = require("typeorm");
const guild_entity_1 = require("./guild.entity");
let Embed = class Embed {
    id;
    title;
    description;
    color;
    guild;
};
exports.Embed = Embed;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Embed.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255, nullable: true }),
    __metadata("design:type", Object)
], Embed.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255, nullable: true }),
    __metadata("design:type", Object)
], Embed.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255, nullable: true }),
    __metadata("design:type", Object)
], Embed.prototype, "color", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => guild_entity_1.Guild, (guild) => guild.embeds, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: "guild_id" }),
    __metadata("design:type", guild_entity_1.Guild)
], Embed.prototype, "guild", void 0);
exports.Embed = Embed = __decorate([
    (0, typeorm_1.Entity)("embed")
], Embed);
//# sourceMappingURL=embed.entity.js.map