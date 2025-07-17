import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { writeFile } from 'fs/promises';
import { join } from 'path';

@Injectable()
export class FilesService {
  constructor(private readonly prisma: PrismaService) {}

  async uploadFile(file: Express.Multer.File) {
    const uploadPath = join(__dirname, '../../../', 'public', 'uploads');
    const fileName = Date.now() + file.originalname;
    const filePath = join(uploadPath, fileName);

    await writeFile(filePath, file.buffer);

    return this.prisma.file.create({
      data: {
        url: `/uploads/${fileName}`,
        mimetype: file.mimetype,
        size: file.size,
      },
    });
  }
}
