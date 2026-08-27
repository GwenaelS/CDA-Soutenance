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
exports.Channel_log = void 0;
const typeorm_1 = require("typeorm");
const enum_1 = require("../enum");
const guild_entity_1 = require("./guild.entity");
let Channel_log = class Channel_log {
    id;
    type;
    channel_id;
    guild;
};
exports.Channel_log = Channel_log;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Channel_log.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: enum_1.LogType }),
    __metadata("design:type", String)
], Channel_log.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "bigint", unsigned: true }),
    __metadata("design:type", String)
], Channel_log.prototype, "channel_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => guild_entity_1.Guild, (guild) => guild.channelLogs, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: "guild_id" }),
    __metadata("design:type", guild_entity_1.Guild)
], Channel_log.prototype, "guild", void 0);
exports.Channel_log = Channel_log = __decorate([
    (0, typeorm_1.Entity)("channel_log")
], Channel_log);
//# sourceMappingURL=log-channel.entity.js.map