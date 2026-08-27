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
exports.Moc_channel = void 0;
const typeorm_1 = require("typeorm");
const guild_entity_1 = require("./guild.entity");
let Moc_channel = class Moc_channel {
    id;
    moc_channel_id;
    allow_files;
    allow_images;
    allow_videos;
    allow_links;
    allow_text;
    guild;
};
exports.Moc_channel = Moc_channel;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Moc_channel.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "bigint", unsigned: true }),
    __metadata("design:type", String)
], Moc_channel.prototype, "moc_channel_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "boolean" }),
    __metadata("design:type", Boolean)
], Moc_channel.prototype, "allow_files", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "boolean" }),
    __metadata("design:type", Boolean)
], Moc_channel.prototype, "allow_images", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "boolean" }),
    __metadata("design:type", Boolean)
], Moc_channel.prototype, "allow_videos", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "boolean" }),
    __metadata("design:type", Boolean)
], Moc_channel.prototype, "allow_links", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "boolean" }),
    __metadata("design:type", Boolean)
], Moc_channel.prototype, "allow_text", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => guild_entity_1.Guild, (guild) => guild.moc_channels, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: "guild_id" }),
    __metadata("design:type", guild_entity_1.Guild)
], Moc_channel.prototype, "guild", void 0);
exports.Moc_channel = Moc_channel = __decorate([
    (0, typeorm_1.Entity)("moc_channel")
], Moc_channel);
//# sourceMappingURL=moc-channel.entity.js.map