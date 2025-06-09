import {
  boolean,
  check,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { createdAtTimestamp, updatedAtTimestamp } from "./utils";
import { sql } from "drizzle-orm";
export const ADMIN_TYPE = "admin" as const;

export const USER_TYPE = "user" as const; // aka Homebuyer

export const REALTOR_TYPE = "realtor" as const;

export const DEFAULT_ACCOUNT_TYPE = USER_TYPE;

export const ACCOUNT_TYPES = [ADMIN_TYPE, USER_TYPE, REALTOR_TYPE] as const;


export const users = pgTable(
  "users",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").unique().notNull(),
    emailVerified: boolean("email_verified").default(false).notNull(),
    image: text("image"),
    role: text("role")
      .default(sql`'${sql.raw(DEFAULT_ACCOUNT_TYPE)}'`)
      .notNull(),
    phoneNumber: text("phone_number"),
    phoneNumberVerified: boolean("phone_number_verified"),
    banned: boolean("banned").default(false).notNull(),
    bannedReason: text("banned_reason"),
    banExpires: timestamp("ban_expires", {
      mode: "date",
    }),
    createdAt: createdAtTimestamp,
    updatedAt: updatedAtTimestamp,
  },
  (table) => [
    uniqueIndex("unique_phone_number")
      .on(table.phoneNumber)
      .where(sql`${table.phoneNumber} IS NOT NULL`),
  ]
);

export type User = typeof users.$inferSelect;

export type InsertUser = Omit<User, "id" | "createdAt" | "updatedAt">;

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  token: text("token").unique().notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  impersonatedBy: text("impersonated_by"),
  expiresAt: timestamp("expires_at", {
    mode: "date",
  }).notNull(),
  createdAt: createdAtTimestamp,
  updatedAt: updatedAtTimestamp,
});

export type Session = typeof sessions.$inferSelect;

export type InsertSession = Omit<Session, "id" | "createdAt" | "updatedAt">;

export const accounts = pgTable("accounts", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("userId")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at", {
    mode: "date",
  }),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at", {
    mode: "date",
  }),
  scope: text("scope"),
  password: text("password"),
  createdAt: createdAtTimestamp,
  updatedAt: updatedAtTimestamp,
});

export type Account = typeof accounts.$inferSelect;

export type InsertAccount = Omit<Account, "id" | "createdAt" | "updatedAt">;

export const verifications = pgTable("verifications", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at", {
    mode: "date",
  }).notNull(),
  createdAt: createdAtTimestamp,
  updatedAt: updatedAtTimestamp,
});

export type Verification = typeof verifications.$inferSelect;

export type InsertVerification = Omit<Verification, "id" | "createdAt" | "updatedAt">;

export const passkeys = pgTable("passkeys", {
  id: text("id").primaryKey(),
  name: text("name"),
  publicKey: text("public_key").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  credentialID: text("credential_id").notNull(),
  counter: integer("counter").notNull(),
  deviceType: text("device_type").notNull(),
  backedUp: boolean("backed_up").default(false).notNull(),
  transports: text("transports").notNull(),
  createdAt: createdAtTimestamp,
});

export type Passkey = typeof passkeys.$inferSelect;

export type InsertPasskey = Omit<Passkey, "id" | "createdAt">;

export default {
  users,
  sessions,
  accounts,
  verifications,
  passkeys,
};
