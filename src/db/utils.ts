import { sql } from "drizzle-orm";
import { timestamp } from "drizzle-orm/pg-core";

export const createdAtTimestamp = timestamp("created_at", {
  mode: "date",
})
  .defaultNow()
  .notNull();

export const updatedAtTimestamp = timestamp("updated_at", {
  mode: "date",
})
  .defaultNow()
  .$onUpdateFn(() => new Date())
  .notNull();
