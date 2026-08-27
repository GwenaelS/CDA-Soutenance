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
exports.Warning = void 0;
const typeorm_1 = require("typeorm");
const member_entity_1 = require("./member.entity");
let Warning = class Warning {
    id;
    author_id;
    reason;
    time;
    is_active;
    member;
};
exports.Warning = Warning;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Warning.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "bigint", unsigned: true }),
    __metadata("design:type", String)
], Warning.prototype, "author_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text" }),
    __metadata("design:type", String)
], Warning.prototype, "reason", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "datetime" }),
    __metadata("design:type", Date)
], Warning.prototype, "time", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "boolean", default: true }),
    __metadata("design:type", Boolean)
], Warning.prototype, "is_active", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => member_entity_1.Member, (member) => member.warnings, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: "member_id" }),
    __metadata("design:type", member_entity_1.Member)
], Warning.prototype, "member", void 0);
exports.Warning = Warning = __decorate([
    (0, typeorm_1.Entity)("warning")
], Warning);
//# sourceMappingURL=warning.entity.js.map