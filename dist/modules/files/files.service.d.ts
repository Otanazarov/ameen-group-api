import { PrismaService } from '../prisma/prisma.service';
export declare class FilesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    uploadFile(file: Express.Multer.File): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        url: string;
        mimetype: string;
        size: number;
        hash: string;
    }>;
}
