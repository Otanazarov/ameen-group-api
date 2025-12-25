export interface CreateContractRequest {
    tariffId: string;
    cardToken: string;
}

export interface CreateContractResponse {
    data: {
        id: string;
        contractDate: number;
        nextPayDate: number;
        status: string;
        price: number;
        deactivateDate: number | null;
        tryPaymentCount: number;
        createdDate: number;
        modifiedDate: number;
        merchant: {
            name: {
                uz: string;
                ru: string;
                en: string;
            };
            logo: string;
        };
        tariff: {
            id: string;
            title: {
                uz: string;
                ru: string;
                en: string;
            };
            tryCount: number;
            amount: number | string;
            period: string;
            trialDays: number;
        };
        card: {
            id: string;
            holder: string;
            type: string;
            pan: string;
            status: string;
        };
    };
}

export interface RegisterCardRequest {
    pan: string;
    expMonth: string;
    expYear: string;
    phone: string;
}

export interface RegisterCardResponse {
    verifyId: string;
    phoneMask: string;
}

// Note: CreateContractResponse, DeactivateResponse and the new ContractInfoResponse share the same base structure.
export type ContractInfoResponse = CreateContractResponse;

export interface VerifyCardRequest {
    userId: number;
    verifyId: string;
    verifyCode: string;
}

export interface VerifyCardResponse {
    first6: string;
    last4: string;
    expMonth: string;
    expYear: string;
    bin: string;
    cardHolder: string;
    bankName: string;
    bankCode: string;
    token: string;
    hashPan: string;
    processing: "UZCARD" | "HUMO";
    type: "PRIVATE" | string;
}

export interface DeactivateResponse {
    data: {
        id: string;
        contractDate: number;
        nextPayDate: number;
        status: "PAUSE" | "ACTIVE" | string;
        price: number;
        deactivateDate: number;
        tryPaymentCount: number;
        createdDate: number;
        modifiedDate: number;
        merchant: {
            name: {
                uz: string;
                ru: string;
                en: string;
            };
            logo: string;
        };
        tariff: {
            id: string;
            title: {
                uz: string;
                ru: string;
                en: string;
            };
            tryCount: number;
            amount: number | string;
            period: string;
            trialDays: number;
        };
        card: {
            id: string;
            holder: string;
            type: string;
            pan: string;
            status: string;
        };
    };
}
export interface DeleteResponse {
    data: null;
}

export interface CardInfoRequest {
    token: string;
}

export interface CardInfoResponse {
    first6: string;
    last4: string;
    expMonth: string;
    expYear: string;
    bin: string;
    cardHolder: string;
    bankName: string;
    bankCode: string;
    token: string;
    hashPan: string | null;
    processing: "UZCARD" | "HUMO" | string;
    type: "PRIVATE" | string;
}
