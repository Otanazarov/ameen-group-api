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
exports.FilesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const promises_1 = require("fs/promises");
const path_1 = require("path");
const crypto_1 = require("crypto");
let FilesService = class FilesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async uploadFile(file) {
        const uploadPath = (0, path_1.join)(__dirname, '../../../', 'public', 'uploads');
        const hash = (0, crypto_1.createHash)('sha256').update(file.buffer).digest('hex');
        const hashFile = await this.prisma.file.findFirst({ where: { hash } });
        if (hashFile)
            return hashFile;
        const fileName = Date.now() + file.originalname;
        const filePath = (0, path_1.join)(uploadPath, fileName);
        await (0, promises_1.writeFile)(filePath, file.buffer);
        return this.prisma.file.create({
            data: {
                url: `/uploads/${fileName}`,
                mimetype: file.mimetype,
                size: file.size,
                hash,
            },
        });
    }
};
exports.FilesService = FilesService;
exports.FilesService = FilesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FilesService);
//# sourceMappingURL=files.service.js.map