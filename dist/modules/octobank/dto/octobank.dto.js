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
exports.OctobankDto = exports.OctobankStatus = void 0;
const class_validator_1 = require("class-validator");
var OctobankStatus;
(function (OctobankStatus) {
    OctobankStatus["created"] = "created";
    OctobankStatus["canceled"] = "canceled";
    OctobankStatus["wait_user_action"] = "wait_user_action";
    OctobankStatus["waiting_for_capture"] = "waiting_for_capture";
    OctobankStatus["succeeded"] = "succeeded";
})(OctobankStatus || (exports.OctobankStatus = OctobankStatus = {}));
class OctobankDto {
}
exports.OctobankDto = OctobankDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], OctobankDto.prototype, "shop_transaction_id", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], OctobankDto.prototype, "octo_payment_UUID", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OctobankDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OctobankDto.prototype, "signature", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OctobankDto.prototype, "hash_key", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], OctobankDto.prototype, "total_sum", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], OctobankDto.prototype, "transfer_sum", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], OctobankDto.prototype, "refunded_sum", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OctobankDto.prototype, "maskedPan", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], OctobankDto.prototype, "riskLevel", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], OctobankDto.prototype, "payed_time", void 0);
//# sourceMappingURL=octobank.dto.js.map