import { Injectable, OnModuleInit } from "@nestjs/common";
import { CreateSettingDto } from "./dto/create-setting.dto";
import { UpdateSettingDto } from "./dto/update-setting.dto";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class SettingsService implements OnModuleInit {
	constructor(private readonly prisma: PrismaService) {}

	async onModuleInit() {
		const settings = await this.findOne();
		if (!settings)
			this.create({ aboutAminGroup: "info1", aboutKozimxonTorayev: "info2" });
	}

	async create(createSettingDto: CreateSettingDto) {
		const settings = await this.prisma.settings.create({
			data: createSettingDto,
		});
		return settings;
	}

	async findOne() {
		const settings = await this.prisma.settings.findUnique({
			where: { id: 1 },
			include: {
				aboutAminGroupImage: true,
				contactImage: true,
			},
		});
		return settings;
	}

	async update(updateSettingDto: UpdateSettingDto) {
		const existing = await this.prisma.settings.findUnique({
			where: { id: 1 },
		});

		if (!existing) {
			throw new Error(`Settings with id ${1} not found`);
		}

		const updated = await this.prisma.settings.update({
			where: { id: 1 },
			data: updateSettingDto,
		});

		return updated;
	}
}
