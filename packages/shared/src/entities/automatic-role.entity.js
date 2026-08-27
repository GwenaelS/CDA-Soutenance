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
exports.Automatic_role = void 0;
const typeorm_1 = require("typeorm");
const guild_entity_1 = require("./guild.entity");
let Automatic_role = class Automatic_role {
    id;
    role_id;
    guild;
};
exports.Automatic_role = Automatic_role;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Automatic_role.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "bigint", unsigned: true }),
    __metadata("design:type", String)
], Automatic_role.prototype, "role_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => guild_entity_1.Guild, (guild) => guild.automatic_roles, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: "guild_id" }),
    __metadata("design:type", guild_entity_1.Guild)
], Automatic_role.prototype, "guild", void 0);
exports.Automatic_role = Automatic_role = __decorate([
    (0, typeorm_1.Entity)("automatic_role")
], Automatic_role);
//# sourceMappingURL=automatic-role.entity.js.map