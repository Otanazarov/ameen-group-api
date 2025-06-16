import { Context as GrammyContext, SessionFlavor } from 'grammy';

export type SessionData = {
  name?: string;
  phone?: string;
  email?: string;
};

export type Context = GrammyContext & SessionFlavor<SessionData>;
