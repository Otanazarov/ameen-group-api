import { Context as GrammyContext, SessionFlavor } from 'grammy';
export type SessionData = {
    first_name?: string;
    last_name?: string;
    phone?: string;
    email?: string;
    id?: number;
    edit?: string;
    message_id?: number;
};
export type Context = GrammyContext & SessionFlavor<SessionData>;
