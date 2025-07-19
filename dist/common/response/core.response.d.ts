export declare class CoreApiResponse<TData> {
    readonly success: boolean;
    readonly data: TData | null;
    readonly error: any;
    private constructor();
    static success<TData>(data: TData): CoreApiResponse<TData>;
    static error<TData>(error?: any): CoreApiResponse<TData>;
}
