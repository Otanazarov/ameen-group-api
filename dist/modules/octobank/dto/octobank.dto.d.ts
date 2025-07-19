export declare enum OctobankStatus {
    created = "created",
    canceled = "canceled",
    wait_user_action = "wait_user_action",
    waiting_for_capture = "waiting_for_capture",
    succeeded = "succeeded"
}
export declare class OctobankDto {
    shop_transaction_id: string;
    octo_payment_UUID: string;
    status: OctobankStatus;
    signature: string;
    hash_key: string;
    total_sum: number;
    transfer_sum: number;
    refunded_sum: number;
    maskedPan: string;
    riskLevel: number;
    payed_time: string;
}
