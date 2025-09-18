import { HttpException, Injectable, Redirect } from "@nestjs/common";
import { CreateAtmosDto } from "./dto/create.dto";
import { PrismaService } from "../prisma/prisma.service";
import { env } from "src/common/config";
import { atmosApi } from "src/common/utils/axios";
import { TransactionService } from "../trasnaction/transaction.service";
import { TransactionStatus } from "@prisma/client";
import { PreApplyAtmosDto } from "./dto/preapply.dto";
import { HttpError } from "src/common/exception/http.error";
import { TelegramService } from "../telegram/telegram.service";
import dayjs from "dayjs";
import { BindCardInitDto } from "./dto/bind-card-init.dto";
import { BindCardConfirmDto } from "./dto/bind-card-confirm.dto";
import { ConfirmSchedulerDto } from "./dto/confirm-scheduler.dto";

@Injectable()
export class AtmosService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly transactionService: TransactionService,
		private readonly telegramService: TelegramService,
	) {}

	async createScheduler(dto: {
		date_start: Date;
		login: string;
		pay_day: number;
		ext_id: string;
		amount: number;
		cards: string[];
		account: string;
		repeat_interval: number;
	}) {
		const { data } = await atmosApi.post("/pay-scheduler/create", {
			payment: {
				date_start: dayjs(dto.date_start).format("YYYY-MM-DD"),
				date_finish: dayjs().add(100, "year").format("YYYY-MM-DD"),
				login: dto.login,
				pay_day: dto.pay_day,
				pay_time: "08:00",
				repeat_interval: dto.repeat_interval,
				repeat_times: 999,
				ext_id: dto.ext_id,
				repeat_low_balance: true,
				amount: dto.amount,
				cards: `[${dto.cards.join(",")}]`,
				store_id: env.ATMOS_STORE_ID,
				account: dto.account,
			},
		});

		return data;
	}

	async confirmScheduler(dto: ConfirmSchedulerDto) {
		const { data } = await atmosApi.post("/pay-scheduler/confirm", dto);

		return data;
	}

	async deleteScheduler(scheduler_id: string) {
		const { data } = await atmosApi.post("/pay-scheduler/delete", {
			scheduler_id,
		});

		return data;
	}

	async getScheduler(scheduler_id: string) {
		const { data } = await atmosApi.post("/pay-scheduler/get", {
			scheduler_id,
		});

		return data;
	}

	async getSchedulers(login: string) {
		const { data } = await atmosApi.post("/pay-scheduler/get-all", {
			login,
		});

		return data;
	}

	private async _createScheduler(userId: number, subscriptionTypeId: number) {
		const user = await this.prisma.user.findUnique({
			where: { id: userId },
		});
		if (!user) {
			throw new HttpException("User not found", 404);
		}
		const subscriptionType = await this.prisma.subscriptionType.findUnique({
			where: { id: subscriptionTypeId },
		});
		if (!subscriptionType) {
			throw new HttpException("Subscription type not found", 404);
		}

		const cards = (user.cards as string[]) || [];

		if (cards.length === 0) {
			throw new HttpException(
				"User has no saved cards. Please add a card first.",
				400,
			);
		}

		const transaction = await this.transactionService.create({
			userId: user.id,
			subscriptionTypeId,
			price: subscriptionType.price,
			paymentType: "ATMOS",
			status: "Created",
			transactionId: null,
		});

		const repeat_interval = 1; // monthly

		const schedulerData = {
			date_start: new Date(),
			login: user.username,
			pay_day: dayjs().date(),
			ext_id: transaction.id.toString(),
			amount: subscriptionType.price * 100,
			cards: cards,
			account: user.id.toString(),
			repeat_interval: repeat_interval,
		};

		const scheduler = await this.createScheduler(schedulerData);

		if (!scheduler.scheduler_id) {
			await this.transactionService.update(transaction.id, {
				status: "Failed",
			});
			throw new HttpException("Failed to create payment scheduler.", 500);
		}

		await this.prisma.user.update({
			where: { id: userId },
			data: { schedulerId: scheduler.scheduler_id.toString() },
		});

		await this.transactionService.update(transaction.id, {
			transactionId: scheduler.scheduler_id.toString(),
		});

		return scheduler;
	}

	async createLink(dto: CreateAtmosDto) {
		const { userId, subscriptionTypeId } = dto;
		if (!userId || !subscriptionTypeId) {
			throw new HttpException("Missing userId or subscriptionTypeId", 400);
		}
		return this._createScheduler(userId, subscriptionTypeId);
	}
	async preApplyTransaction(dto: PreApplyAtmosDto): Promise<any> {
		const preApplyData = {
			transaction_id: dto.transaction_id,
			card_number: dto.card_number,
			expiry: dto.expiry,
			store_id: env.ATMOS_STORE_ID,
		};

		const result = await atmosApi.post("/merchant/pay/pre-apply", preApplyData);
		if (result.data.result.code !== "OK") {
			throw new HttpError({ message: result.data.result.description });
		}

		return result.data;
	}
	async applyTransaction(dto: {
		transaction_id: number;
		otp: string;
	}): Promise<any> {
		const applyData = {
			transaction_id: dto.transaction_id.toString(),
			otp: dto.otp,
			store_id: env.ATMOS_STORE_ID,
		};

		const result = await atmosApi.post("/merchant/pay/apply", applyData);
		if (result.data.result.code === "OK") {
			const subscription = await this.transactionService.findOneByTransactionId(
				result.data.store_transaction.trans_id.toString(),
			);
			await this.transactionService.update(subscription.id, {
				status: TransactionStatus.Paid,
			});

			return {
				redirect: `https://t.me/${this.telegramService.bot.botInfo.username}?start=success`,
			};
		} else {
			throw new HttpError({ message: result.data.result.description });
		}
	}

	async getPendingInvoices() {
		return this.prisma.transaction.findMany({
			where: {
				status: TransactionStatus.Created,
				paymentType: "ATMOS",
				createdAt: {
					gt: new Date(Date.now() - 1000 * 60 * 30),
				},
			},
		});
	}

	async checkTransactionStatus(transactionId: string) {
		const { data } = await atmosApi.post("/merchant/pay/get", {
			store_id: +env.ATMOS_STORE_ID,
			transaction_id: +transactionId,
		});

		const transaction =
			await this.transactionService.findOneByTransactionId(transactionId);
		if (!transaction) {
			throw new Error("Transaction not found");
		}

		const isSuccess =
			data.store_transaction?.confirmed === true &&
			data.store_transaction?.status_message === "Success";

		if (isSuccess) {
			await this.transactionService.update(transaction.id, { status: "Paid" });
		} else if (
			data.store_transaction?.status_message === "Canceled" ||
			data.result?.code === "STPIMS-ERR-092"
		) {
			await this.transactionService.update(transaction.id, {
				status: "Canceled",
			});
		}
		return data;
	}

	async bindCardInit(dto: BindCardInitDto) {
		const { data } = await atmosApi.post("/partner/bind-card/init", dto);
		return data;
	}

	async bindCardConfirm(dto: BindCardConfirmDto) {
		const { data } = await atmosApi.post("/partner/bind-card/confirm", {
			transaction_id: dto.transaction_id,
			otp: dto.otp,
		});

		let schedulerData = null;

		if (data.result.code == "OK") {
			const user = await this.prisma.user.findUnique({
				where: { id: dto.userId },
			});

			let existingCards: string[] = [];
			if (user.cards && Array.isArray(user.cards)) {
				existingCards = user.cards as string[];
			}

			const newCards = [...existingCards, data.data.card_id];

			await this.prisma.user.update({
				where: { id: dto.userId },
				data: {
					cards: newCards,
				},
			});

			if (dto.subscriptionTypeId) {
				schedulerData = await this._createScheduler(dto.userId, dto.subscriptionTypeId);
			}
		}
		return { cardConfirmData: data, schedulerData };
	}
}
