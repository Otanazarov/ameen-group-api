import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { writeFile } from 'fs/promises';
import { join } from 'path';

@Injectable()
export class FilesService {
  constructor(private readonly prisma: PrismaService) {}

  async uploadFile(file: Express.Multer.File) {
    const uploadPath = join(__dirname, 'public', 'uploads');
    const filePath = join(uploadPath, file.originalname);

    await writeFile(filePath, file.buffer);

    return this.prisma.file.create({
      data: {
        url: `/uploads/${file.originalname}`,
        mimetype: file.mimetype,
        size: file.size,
      },
    });
  }
}
