export declare enum InlineButtonActions {
    SUBSCRIPTONS = "subscriptons",
    BUY_SUBSCRIPTON = "subscribe-",
    ABOUT_US = "about_us",
    ABOUT_OWNER = "about_owner",
    MY_SUBSCRIPTION = "my_subscriptions"
}
export declare class InlineButtonDto {
    text: string;
    url?: string;
    data?: InlineButtonActions;
}
