import { Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaService } from "src/modules/prisma/prisma.service";

@Injectable()
export class TelegramButtonService implements OnModuleInit {
	private buttonMap = new Map<string, string>();

	constructor(private readonly prismaService: PrismaService) {}

	async onModuleInit() {
		await this.loadButtons();
	}

	async loadButtons() {
		const buttons = await this.prismaService.inlineButton.findMany();
		buttons.forEach((button) => {
			this.buttonMap.set(button.text, button.data);
		});
	}

	getButtonData(text: string): string | undefined {
		return this.buttonMap.get(text);
	}

	get allButtons() {
		return this.prismaService.inlineButton.findMany();
	}
}
