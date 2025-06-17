import { Context as GrammyContext, SessionFlavor } from 'grammy';

export type SessionData = {
  name?: string;
  phone?: string;
  email?: string;
  id?: number;
};

export type Context = GrammyContext & SessionFlavor<SessionData>;
